import { Project, ProjectStatus } from "../models/project";

type Listener<T> = (items: T[]) => void;
class ListenerState<T> {
  protected listeners: Listener<T>[] = [];
  addListener(listenerFn: Listener<T>) {
    this.listeners.push(listenerFn);
  }
}
export class State extends ListenerState<Project> {
  private projects: Project[] = [];
  private static instance: State;
  private constructor() {
    super();
  }
  static getInstance() {
    if (this.instance) return this.instance;
    this.instance = new State();
    return this.instance;
  }
  addProject(title: string, desc: string, nums: number) {
    const newProject = new Project(
      Math.random().toString(),
      title,
      desc,
      nums,
      ProjectStatus.Active
    );
    this.projects.push(newProject);
    this.updateListeners();
  }
  moveProject(projectId: string, newStatus: ProjectStatus) {
    const project = this.projects.find((prj) => prj.id === projectId);
    if (project && project.status !== newStatus) {
      project.status = newStatus;
      this.updateListeners();
    }
  }
  private updateListeners() {
    for (const listenerFn of this.listeners) {
      listenerFn(this.projects.slice());
    }
  }
}
export const prjState = State.getInstance();
