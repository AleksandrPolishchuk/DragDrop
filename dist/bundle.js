/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/components/base.ts":
/*!********************************!*\
  !*** ./src/components/base.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
class Component {
    constructor(templateId, renderElemId, insertAtStart, newElemId) {
        this.templateElem = document.getElementById(templateId);
        this.renderElem = document.getElementById(renderElemId);
        const importedNode = document.importNode(this.templateElem.content, true);
        this.element = importedNode.firstElementChild;
        if (newElemId)
            this.element.id = newElemId;
        this.attach(insertAtStart);
    }
    attach(insert) {
        this.renderElem.insertAdjacentElement(insert ? "afterbegin" : "beforeend", this.element);
    }
}
exports["default"] = Component;


/***/ }),

/***/ "./src/components/input.ts":
/*!*********************************!*\
  !*** ./src/components/input.ts ***!
  \*********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Input = void 0;
const state_1 = __webpack_require__(/*! ../state/state */ "./src/state/state.ts");
const base_1 = __importDefault(__webpack_require__(/*! ./base */ "./src/components/base.ts"));
class Input extends base_1.default {
    constructor() {
        super("project", "app", true, "user-input");
        this.titleElem = this.element.querySelector("#title");
        this.descElem = (this.element.querySelector("#description"));
        this.peopleElem = this.element.querySelector("#people");
        this.configure();
    }
    configure() {
        this.element.addEventListener("submit", (e) => {
            e.preventDefault();
            let userInput = [
                this.titleElem.value,
                this.descElem.value,
                +this.peopleElem.value,
            ];
            const [title, desc, people] = userInput;
            state_1.prjState.addProject(title, desc, people);
            this.titleElem.value = "";
            this.descElem.value = "";
            this.peopleElem.value = "";
        });
    }
    contentRender() { }
}
exports.Input = Input;


/***/ }),

/***/ "./src/components/item.ts":
/*!********************************!*\
  !*** ./src/components/item.ts ***!
  \********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Item = void 0;
const base_1 = __importDefault(__webpack_require__(/*! ./base */ "./src/components/base.ts"));
class Item extends base_1.default {
    get persons() {
        return this.project.people === 1
            ? "1 person"
            : `${this.project.people} persons`;
    }
    constructor(hostId, project) {
        super("single", hostId, false, project.id);
        this.dragStartHandler = (event) => {
            event.dataTransfer.setData("text/plain", this.project.id);
            event.dataTransfer.effectAllowed = "move";
        };
        this.dragEndHandler = (_) => {
            console.log("DragEnd");
        };
        this.project = project;
        this.configure();
        this.contentRender();
    }
    configure() {
        this.element.addEventListener("dragstart", this.dragStartHandler);
        this.element.addEventListener("dragend", this.dragEndHandler);
    }
    contentRender() {
        this.element.querySelector("h2").innerText = this.project.title;
        this.element.querySelector("h3").innerText = this.persons + " assigned";
        this.element.querySelector("p").innerText = this.project.description;
    }
}
exports.Item = Item;


/***/ }),

/***/ "./src/components/list.ts":
/*!********************************!*\
  !*** ./src/components/list.ts ***!
  \********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.List = void 0;
const project_1 = __webpack_require__(/*! ../models/project */ "./src/models/project.ts");
const base_1 = __importDefault(__webpack_require__(/*! ./base */ "./src/components/base.ts"));
const state_1 = __webpack_require__(/*! ../state/state */ "./src/state/state.ts");
const item_1 = __webpack_require__(/*! ./item */ "./src/components/item.ts");
class List extends base_1.default {
    constructor(type) {
        super("list", "app", false, `${type}-projects`);
        this.type = type;
        this.dragOverHandler = (event) => {
            if (event.dataTransfer && event.dataTransfer.types[0] === "text/plain") {
                event.preventDefault();
                const listEl = this.element.querySelector("ul");
                listEl.classList.add("droppable");
            }
        };
        this.dropHandler = (event) => {
            const prjId = event.dataTransfer.getData("text/plain");
            state_1.prjState.moveProject(prjId, this.type === "active" ? project_1.ProjectStatus.Active : project_1.ProjectStatus.Finished);
        };
        this.dragLeaveHandler = (_) => {
            const listEl = this.element.querySelector("ul");
            listEl.classList.remove("droppable");
        };
        this.assignedProjects = [];
        this.configure();
        this.contentRender();
    }
    configure() {
        this.element.addEventListener("dragover", this.dragOverHandler);
        this.element.addEventListener("dragleave", this.dragLeaveHandler);
        this.element.addEventListener("drop", this.dropHandler);
        state_1.prjState.addListener((projects) => {
            const relevantProjects = projects.filter((prj) => this.type === "active"
                ? prj.status === project_1.ProjectStatus.Active
                : prj.status === project_1.ProjectStatus.Finished);
            this.assignedProjects = relevantProjects;
            this.projectsRender();
        });
    }
    contentRender() {
        const listId = `${this.type}-projects-list`;
        this.element.querySelector("ul").id = listId;
        this.element.querySelector("h2").innerText = `${this.type.toUpperCase()}PROJECTS`;
    }
    projectsRender() {
        const listEl = (document.getElementById(`${this.type}-projects-list`));
        listEl.innerHTML = "";
        for (const prjItem of this.assignedProjects) {
            new item_1.Item(this.element.querySelector("ul").id, prjItem);
        }
    }
}
exports.List = List;


/***/ }),

/***/ "./src/models/project.ts":
/*!*******************************!*\
  !*** ./src/models/project.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Project = exports.ProjectStatus = void 0;
var ProjectStatus;
(function (ProjectStatus) {
    ProjectStatus[ProjectStatus["Active"] = 0] = "Active";
    ProjectStatus[ProjectStatus["Finished"] = 1] = "Finished";
})(ProjectStatus || (exports.ProjectStatus = ProjectStatus = {}));
class Project {
    constructor(id, title, description, people, status) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.people = people;
        this.status = status;
    }
}
exports.Project = Project;


/***/ }),

/***/ "./src/state/state.ts":
/*!****************************!*\
  !*** ./src/state/state.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.prjState = exports.State = void 0;
const project_1 = __webpack_require__(/*! ../models/project */ "./src/models/project.ts");
class ListenerState {
    constructor() {
        this.listeners = [];
    }
    addListener(listenerFn) {
        this.listeners.push(listenerFn);
    }
}
class State extends ListenerState {
    constructor() {
        super();
        this.projects = [];
    }
    static getInstance() {
        if (this.instance)
            return this.instance;
        this.instance = new State();
        return this.instance;
    }
    addProject(title, desc, nums) {
        const newProject = new project_1.Project(Math.random().toString(), title, desc, nums, project_1.ProjectStatus.Active);
        this.projects.push(newProject);
        this.updateListeners();
    }
    moveProject(projectId, newStatus) {
        const project = this.projects.find((prj) => prj.id === projectId);
        if (project && project.status !== newStatus) {
            project.status = newStatus;
            this.updateListeners();
        }
    }
    updateListeners() {
        for (const listenerFn of this.listeners) {
            listenerFn(this.projects.slice());
        }
    }
}
exports.State = State;
exports.prjState = State.getInstance();


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
const input_1 = __webpack_require__(/*! ./components/input */ "./src/components/input.ts");
const list_1 = __webpack_require__(/*! ./components/list */ "./src/components/list.ts");
new input_1.Input();
new list_1.List("active");
new list_1.List("finished");

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0E7O1VBRUE7VUFDQTtVQUNBOzs7Ozs7Ozs7O0FDdEJhO0FBQ2IsOENBQTZDLEVBQUUsYUFBYSxFQUFDO0FBQzdELGdCQUFnQixtQkFBTyxDQUFDLHFEQUFvQjtBQUM1QyxlQUFlLG1CQUFPLENBQUMsbURBQW1CO0FBQzFDO0FBQ0E7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL2RyYWctZHJvcC8uL3NyYy9jb21wb25lbnRzL2Jhc2UudHMiLCJ3ZWJwYWNrOi8vZHJhZy1kcm9wLy4vc3JjL2NvbXBvbmVudHMvaW5wdXQudHMiLCJ3ZWJwYWNrOi8vZHJhZy1kcm9wLy4vc3JjL2NvbXBvbmVudHMvaXRlbS50cyIsIndlYnBhY2s6Ly9kcmFnLWRyb3AvLi9zcmMvY29tcG9uZW50cy9saXN0LnRzIiwid2VicGFjazovL2RyYWctZHJvcC8uL3NyYy9tb2RlbHMvcHJvamVjdC50cyIsIndlYnBhY2s6Ly9kcmFnLWRyb3AvLi9zcmMvc3RhdGUvc3RhdGUudHMiLCJ3ZWJwYWNrOi8vZHJhZy1kcm9wL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2RyYWctZHJvcC8uL3NyYy9pbmRleC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNsYXNzIENvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IodGVtcGxhdGVJZCwgcmVuZGVyRWxlbUlkLCBpbnNlcnRBdFN0YXJ0LCBuZXdFbGVtSWQpIHtcbiAgICAgICAgdGhpcy50ZW1wbGF0ZUVsZW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0ZW1wbGF0ZUlkKTtcbiAgICAgICAgdGhpcy5yZW5kZXJFbGVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQocmVuZGVyRWxlbUlkKTtcbiAgICAgICAgY29uc3QgaW1wb3J0ZWROb2RlID0gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0aGlzLnRlbXBsYXRlRWxlbS5jb250ZW50LCB0cnVlKTtcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gaW1wb3J0ZWROb2RlLmZpcnN0RWxlbWVudENoaWxkO1xuICAgICAgICBpZiAobmV3RWxlbUlkKVxuICAgICAgICAgICAgdGhpcy5lbGVtZW50LmlkID0gbmV3RWxlbUlkO1xuICAgICAgICB0aGlzLmF0dGFjaChpbnNlcnRBdFN0YXJ0KTtcbiAgICB9XG4gICAgYXR0YWNoKGluc2VydCkge1xuICAgICAgICB0aGlzLnJlbmRlckVsZW0uaW5zZXJ0QWRqYWNlbnRFbGVtZW50KGluc2VydCA/IFwiYWZ0ZXJiZWdpblwiIDogXCJiZWZvcmVlbmRcIiwgdGhpcy5lbGVtZW50KTtcbiAgICB9XG59XG5leHBvcnRzLmRlZmF1bHQgPSBDb21wb25lbnQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2ltcG9ydERlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0RGVmYXVsdCkgfHwgZnVuY3Rpb24gKG1vZCkge1xuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgXCJkZWZhdWx0XCI6IG1vZCB9O1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuSW5wdXQgPSB2b2lkIDA7XG5jb25zdCBzdGF0ZV8xID0gcmVxdWlyZShcIi4uL3N0YXRlL3N0YXRlXCIpO1xuY29uc3QgYmFzZV8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL2Jhc2VcIikpO1xuY2xhc3MgSW5wdXQgZXh0ZW5kcyBiYXNlXzEuZGVmYXVsdCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKFwicHJvamVjdFwiLCBcImFwcFwiLCB0cnVlLCBcInVzZXItaW5wdXRcIik7XG4gICAgICAgIHRoaXMudGl0bGVFbGVtID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjdGl0bGVcIik7XG4gICAgICAgIHRoaXMuZGVzY0VsZW0gPSAodGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjZGVzY3JpcHRpb25cIikpO1xuICAgICAgICB0aGlzLnBlb3BsZUVsZW0gPSB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcIiNwZW9wbGVcIik7XG4gICAgICAgIHRoaXMuY29uZmlndXJlKCk7XG4gICAgfVxuICAgIGNvbmZpZ3VyZSgpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJzdWJtaXRcIiwgKGUpID0+IHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGxldCB1c2VySW5wdXQgPSBbXG4gICAgICAgICAgICAgICAgdGhpcy50aXRsZUVsZW0udmFsdWUsXG4gICAgICAgICAgICAgICAgdGhpcy5kZXNjRWxlbS52YWx1ZSxcbiAgICAgICAgICAgICAgICArdGhpcy5wZW9wbGVFbGVtLnZhbHVlLFxuICAgICAgICAgICAgXTtcbiAgICAgICAgICAgIGNvbnN0IFt0aXRsZSwgZGVzYywgcGVvcGxlXSA9IHVzZXJJbnB1dDtcbiAgICAgICAgICAgIHN0YXRlXzEucHJqU3RhdGUuYWRkUHJvamVjdCh0aXRsZSwgZGVzYywgcGVvcGxlKTtcbiAgICAgICAgICAgIHRoaXMudGl0bGVFbGVtLnZhbHVlID0gXCJcIjtcbiAgICAgICAgICAgIHRoaXMuZGVzY0VsZW0udmFsdWUgPSBcIlwiO1xuICAgICAgICAgICAgdGhpcy5wZW9wbGVFbGVtLnZhbHVlID0gXCJcIjtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGNvbnRlbnRSZW5kZXIoKSB7IH1cbn1cbmV4cG9ydHMuSW5wdXQgPSBJbnB1dDtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9faW1wb3J0RGVmYXVsdCA9ICh0aGlzICYmIHRoaXMuX19pbXBvcnREZWZhdWx0KSB8fCBmdW5jdGlvbiAobW9kKSB7XG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBcImRlZmF1bHRcIjogbW9kIH07XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5JdGVtID0gdm9pZCAwO1xuY29uc3QgYmFzZV8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL2Jhc2VcIikpO1xuY2xhc3MgSXRlbSBleHRlbmRzIGJhc2VfMS5kZWZhdWx0IHtcbiAgICBnZXQgcGVyc29ucygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJvamVjdC5wZW9wbGUgPT09IDFcbiAgICAgICAgICAgID8gXCIxIHBlcnNvblwiXG4gICAgICAgICAgICA6IGAke3RoaXMucHJvamVjdC5wZW9wbGV9IHBlcnNvbnNgO1xuICAgIH1cbiAgICBjb25zdHJ1Y3Rvcihob3N0SWQsIHByb2plY3QpIHtcbiAgICAgICAgc3VwZXIoXCJzaW5nbGVcIiwgaG9zdElkLCBmYWxzZSwgcHJvamVjdC5pZCk7XG4gICAgICAgIHRoaXMuZHJhZ1N0YXJ0SGFuZGxlciA9IChldmVudCkgPT4ge1xuICAgICAgICAgICAgZXZlbnQuZGF0YVRyYW5zZmVyLnNldERhdGEoXCJ0ZXh0L3BsYWluXCIsIHRoaXMucHJvamVjdC5pZCk7XG4gICAgICAgICAgICBldmVudC5kYXRhVHJhbnNmZXIuZWZmZWN0QWxsb3dlZCA9IFwibW92ZVwiO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmRyYWdFbmRIYW5kbGVyID0gKF8pID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRHJhZ0VuZFwiKTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5wcm9qZWN0ID0gcHJvamVjdDtcbiAgICAgICAgdGhpcy5jb25maWd1cmUoKTtcbiAgICAgICAgdGhpcy5jb250ZW50UmVuZGVyKCk7XG4gICAgfVxuICAgIGNvbmZpZ3VyZSgpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJkcmFnc3RhcnRcIiwgdGhpcy5kcmFnU3RhcnRIYW5kbGVyKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJkcmFnZW5kXCIsIHRoaXMuZHJhZ0VuZEhhbmRsZXIpO1xuICAgIH1cbiAgICBjb250ZW50UmVuZGVyKCkge1xuICAgICAgICB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcImgyXCIpLmlubmVyVGV4dCA9IHRoaXMucHJvamVjdC50aXRsZTtcbiAgICAgICAgdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCJoM1wiKS5pbm5lclRleHQgPSB0aGlzLnBlcnNvbnMgKyBcIiBhc3NpZ25lZFwiO1xuICAgICAgICB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcInBcIikuaW5uZXJUZXh0ID0gdGhpcy5wcm9qZWN0LmRlc2NyaXB0aW9uO1xuICAgIH1cbn1cbmV4cG9ydHMuSXRlbSA9IEl0ZW07XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2ltcG9ydERlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0RGVmYXVsdCkgfHwgZnVuY3Rpb24gKG1vZCkge1xuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgXCJkZWZhdWx0XCI6IG1vZCB9O1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuTGlzdCA9IHZvaWQgMDtcbmNvbnN0IHByb2plY3RfMSA9IHJlcXVpcmUoXCIuLi9tb2RlbHMvcHJvamVjdFwiKTtcbmNvbnN0IGJhc2VfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi9iYXNlXCIpKTtcbmNvbnN0IHN0YXRlXzEgPSByZXF1aXJlKFwiLi4vc3RhdGUvc3RhdGVcIik7XG5jb25zdCBpdGVtXzEgPSByZXF1aXJlKFwiLi9pdGVtXCIpO1xuY2xhc3MgTGlzdCBleHRlbmRzIGJhc2VfMS5kZWZhdWx0IHtcbiAgICBjb25zdHJ1Y3Rvcih0eXBlKSB7XG4gICAgICAgIHN1cGVyKFwibGlzdFwiLCBcImFwcFwiLCBmYWxzZSwgYCR7dHlwZX0tcHJvamVjdHNgKTtcbiAgICAgICAgdGhpcy50eXBlID0gdHlwZTtcbiAgICAgICAgdGhpcy5kcmFnT3ZlckhhbmRsZXIgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGlmIChldmVudC5kYXRhVHJhbnNmZXIgJiYgZXZlbnQuZGF0YVRyYW5zZmVyLnR5cGVzWzBdID09PSBcInRleHQvcGxhaW5cIikge1xuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgY29uc3QgbGlzdEVsID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCJ1bFwiKTtcbiAgICAgICAgICAgICAgICBsaXN0RWwuY2xhc3NMaXN0LmFkZChcImRyb3BwYWJsZVwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5kcm9wSGFuZGxlciA9IChldmVudCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgcHJqSWQgPSBldmVudC5kYXRhVHJhbnNmZXIuZ2V0RGF0YShcInRleHQvcGxhaW5cIik7XG4gICAgICAgICAgICBzdGF0ZV8xLnByalN0YXRlLm1vdmVQcm9qZWN0KHByaklkLCB0aGlzLnR5cGUgPT09IFwiYWN0aXZlXCIgPyBwcm9qZWN0XzEuUHJvamVjdFN0YXR1cy5BY3RpdmUgOiBwcm9qZWN0XzEuUHJvamVjdFN0YXR1cy5GaW5pc2hlZCk7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuZHJhZ0xlYXZlSGFuZGxlciA9IChfKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBsaXN0RWwgPSB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcInVsXCIpO1xuICAgICAgICAgICAgbGlzdEVsLmNsYXNzTGlzdC5yZW1vdmUoXCJkcm9wcGFibGVcIik7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuYXNzaWduZWRQcm9qZWN0cyA9IFtdO1xuICAgICAgICB0aGlzLmNvbmZpZ3VyZSgpO1xuICAgICAgICB0aGlzLmNvbnRlbnRSZW5kZXIoKTtcbiAgICB9XG4gICAgY29uZmlndXJlKCkge1xuICAgICAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImRyYWdvdmVyXCIsIHRoaXMuZHJhZ092ZXJIYW5kbGVyKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJkcmFnbGVhdmVcIiwgdGhpcy5kcmFnTGVhdmVIYW5kbGVyKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJkcm9wXCIsIHRoaXMuZHJvcEhhbmRsZXIpO1xuICAgICAgICBzdGF0ZV8xLnByalN0YXRlLmFkZExpc3RlbmVyKChwcm9qZWN0cykgPT4ge1xuICAgICAgICAgICAgY29uc3QgcmVsZXZhbnRQcm9qZWN0cyA9IHByb2plY3RzLmZpbHRlcigocHJqKSA9PiB0aGlzLnR5cGUgPT09IFwiYWN0aXZlXCJcbiAgICAgICAgICAgICAgICA/IHByai5zdGF0dXMgPT09IHByb2plY3RfMS5Qcm9qZWN0U3RhdHVzLkFjdGl2ZVxuICAgICAgICAgICAgICAgIDogcHJqLnN0YXR1cyA9PT0gcHJvamVjdF8xLlByb2plY3RTdGF0dXMuRmluaXNoZWQpO1xuICAgICAgICAgICAgdGhpcy5hc3NpZ25lZFByb2plY3RzID0gcmVsZXZhbnRQcm9qZWN0cztcbiAgICAgICAgICAgIHRoaXMucHJvamVjdHNSZW5kZXIoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGNvbnRlbnRSZW5kZXIoKSB7XG4gICAgICAgIGNvbnN0IGxpc3RJZCA9IGAke3RoaXMudHlwZX0tcHJvamVjdHMtbGlzdGA7XG4gICAgICAgIHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwidWxcIikuaWQgPSBsaXN0SWQ7XG4gICAgICAgIHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiaDJcIikuaW5uZXJUZXh0ID0gYCR7dGhpcy50eXBlLnRvVXBwZXJDYXNlKCl9UFJPSkVDVFNgO1xuICAgIH1cbiAgICBwcm9qZWN0c1JlbmRlcigpIHtcbiAgICAgICAgY29uc3QgbGlzdEVsID0gKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGAke3RoaXMudHlwZX0tcHJvamVjdHMtbGlzdGApKTtcbiAgICAgICAgbGlzdEVsLmlubmVySFRNTCA9IFwiXCI7XG4gICAgICAgIGZvciAoY29uc3QgcHJqSXRlbSBvZiB0aGlzLmFzc2lnbmVkUHJvamVjdHMpIHtcbiAgICAgICAgICAgIG5ldyBpdGVtXzEuSXRlbSh0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcInVsXCIpLmlkLCBwcmpJdGVtKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbmV4cG9ydHMuTGlzdCA9IExpc3Q7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuUHJvamVjdCA9IGV4cG9ydHMuUHJvamVjdFN0YXR1cyA9IHZvaWQgMDtcbnZhciBQcm9qZWN0U3RhdHVzO1xuKGZ1bmN0aW9uIChQcm9qZWN0U3RhdHVzKSB7XG4gICAgUHJvamVjdFN0YXR1c1tQcm9qZWN0U3RhdHVzW1wiQWN0aXZlXCJdID0gMF0gPSBcIkFjdGl2ZVwiO1xuICAgIFByb2plY3RTdGF0dXNbUHJvamVjdFN0YXR1c1tcIkZpbmlzaGVkXCJdID0gMV0gPSBcIkZpbmlzaGVkXCI7XG59KShQcm9qZWN0U3RhdHVzIHx8IChleHBvcnRzLlByb2plY3RTdGF0dXMgPSBQcm9qZWN0U3RhdHVzID0ge30pKTtcbmNsYXNzIFByb2plY3Qge1xuICAgIGNvbnN0cnVjdG9yKGlkLCB0aXRsZSwgZGVzY3JpcHRpb24sIHBlb3BsZSwgc3RhdHVzKSB7XG4gICAgICAgIHRoaXMuaWQgPSBpZDtcbiAgICAgICAgdGhpcy50aXRsZSA9IHRpdGxlO1xuICAgICAgICB0aGlzLmRlc2NyaXB0aW9uID0gZGVzY3JpcHRpb247XG4gICAgICAgIHRoaXMucGVvcGxlID0gcGVvcGxlO1xuICAgICAgICB0aGlzLnN0YXR1cyA9IHN0YXR1cztcbiAgICB9XG59XG5leHBvcnRzLlByb2plY3QgPSBQcm9qZWN0O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLnByalN0YXRlID0gZXhwb3J0cy5TdGF0ZSA9IHZvaWQgMDtcbmNvbnN0IHByb2plY3RfMSA9IHJlcXVpcmUoXCIuLi9tb2RlbHMvcHJvamVjdFwiKTtcbmNsYXNzIExpc3RlbmVyU3RhdGUge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmxpc3RlbmVycyA9IFtdO1xuICAgIH1cbiAgICBhZGRMaXN0ZW5lcihsaXN0ZW5lckZuKSB7XG4gICAgICAgIHRoaXMubGlzdGVuZXJzLnB1c2gobGlzdGVuZXJGbik7XG4gICAgfVxufVxuY2xhc3MgU3RhdGUgZXh0ZW5kcyBMaXN0ZW5lclN0YXRlIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5wcm9qZWN0cyA9IFtdO1xuICAgIH1cbiAgICBzdGF0aWMgZ2V0SW5zdGFuY2UoKSB7XG4gICAgICAgIGlmICh0aGlzLmluc3RhbmNlKVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaW5zdGFuY2U7XG4gICAgICAgIHRoaXMuaW5zdGFuY2UgPSBuZXcgU3RhdGUoKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5zdGFuY2U7XG4gICAgfVxuICAgIGFkZFByb2plY3QodGl0bGUsIGRlc2MsIG51bXMpIHtcbiAgICAgICAgY29uc3QgbmV3UHJvamVjdCA9IG5ldyBwcm9qZWN0XzEuUHJvamVjdChNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKCksIHRpdGxlLCBkZXNjLCBudW1zLCBwcm9qZWN0XzEuUHJvamVjdFN0YXR1cy5BY3RpdmUpO1xuICAgICAgICB0aGlzLnByb2plY3RzLnB1c2gobmV3UHJvamVjdCk7XG4gICAgICAgIHRoaXMudXBkYXRlTGlzdGVuZXJzKCk7XG4gICAgfVxuICAgIG1vdmVQcm9qZWN0KHByb2plY3RJZCwgbmV3U3RhdHVzKSB7XG4gICAgICAgIGNvbnN0IHByb2plY3QgPSB0aGlzLnByb2plY3RzLmZpbmQoKHByaikgPT4gcHJqLmlkID09PSBwcm9qZWN0SWQpO1xuICAgICAgICBpZiAocHJvamVjdCAmJiBwcm9qZWN0LnN0YXR1cyAhPT0gbmV3U3RhdHVzKSB7XG4gICAgICAgICAgICBwcm9qZWN0LnN0YXR1cyA9IG5ld1N0YXR1cztcbiAgICAgICAgICAgIHRoaXMudXBkYXRlTGlzdGVuZXJzKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgdXBkYXRlTGlzdGVuZXJzKCkge1xuICAgICAgICBmb3IgKGNvbnN0IGxpc3RlbmVyRm4gb2YgdGhpcy5saXN0ZW5lcnMpIHtcbiAgICAgICAgICAgIGxpc3RlbmVyRm4odGhpcy5wcm9qZWN0cy5zbGljZSgpKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbmV4cG9ydHMuU3RhdGUgPSBTdGF0ZTtcbmV4cG9ydHMucHJqU3RhdGUgPSBTdGF0ZS5nZXRJbnN0YW5jZSgpO1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgaW5wdXRfMSA9IHJlcXVpcmUoXCIuL2NvbXBvbmVudHMvaW5wdXRcIik7XG5jb25zdCBsaXN0XzEgPSByZXF1aXJlKFwiLi9jb21wb25lbnRzL2xpc3RcIik7XG5uZXcgaW5wdXRfMS5JbnB1dCgpO1xubmV3IGxpc3RfMS5MaXN0KFwiYWN0aXZlXCIpO1xubmV3IGxpc3RfMS5MaXN0KFwiZmluaXNoZWRcIik7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=