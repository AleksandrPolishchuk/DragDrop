import { prjState } from "../state/state";
import Component from "./base";
export class Input extends Component<HTMLDivElement, HTMLFormElement> {
  titleElem: HTMLInputElement;
  descElem: HTMLInputElement;
  peopleElem: HTMLInputElement;
  constructor() {
    super("project", "app", true, "user-input");
    this.titleElem = <HTMLInputElement>this.element.querySelector("#title");
    this.descElem = <HTMLInputElement>(
      this.element.querySelector("#description")
    );
    this.peopleElem = <HTMLInputElement>this.element.querySelector("#people");
    this.configure();
  }
  configure() {
    this.element.addEventListener("submit", (e) => {
      e.preventDefault();
      let userInput: [string, string, number] = [
        this.titleElem.value,
        this.descElem.value,
        +this.peopleElem.value,
      ];
      const [title, desc, people] = userInput;
      prjState.addProject(title, desc, people);
      this.titleElem.value = "";
      this.descElem.value = "";
      this.peopleElem.value = "";
    });
  }

  contentRender() {}
}
