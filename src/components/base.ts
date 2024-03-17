export default abstract class Component<
  T extends HTMLElement,
  U extends HTMLElement
> {
  templateElem: HTMLTemplateElement;
  renderElem: T;
  element: U;

  constructor(
    templateId: string,
    renderElemId: string,
    insertAtStart: boolean,
    newElemId?: string
  ) {
    this.templateElem = document.getElementById(
      templateId
    )! as HTMLTemplateElement;
    this.renderElem = document.getElementById(renderElemId)! as T;
    const importedNode = document.importNode(this.templateElem.content, true);
    this.element = importedNode.firstElementChild as U;
    if (newElemId) this.element.id = newElemId;
    this.attach(insertAtStart);
  }

  private attach(insert: boolean) {
    this.renderElem.insertAdjacentElement(
      insert ? "afterbegin" : "beforeend",
      this.element
    );
  }

  abstract configure(): void;
  abstract contentRender(): void;
}
