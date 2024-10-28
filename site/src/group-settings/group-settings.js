import { BaseElement } from "../base-element/base-element";
import { appearance } from "../appearance";

export class GroupSettings extends BaseElement {
  constructor() {
    super();
  }

  /* eslint-disable no-unused-vars */
  html() {
    const selectedPanelDockSide = appearance.getLayout();
    const style = appearance.getTheme();
    return `{{group-settings.html}}`;
  }
  /* eslint-enable no-unused-vars */

  connectedCallback() {
    super.connectedCallback();
    this.render();
    this.memberSection = this.querySelector(".group-settings__members");
    this.panelDockSide = this.querySelector(".group-settings__panels");
    this.appearanceStyle = this.querySelector(".group-settings__style");
    this.membersList = this.querySelector(".group-settings__members-list");

    this.subscribe("members-updated", this.handleUpdatedMembers.bind(this));
    this.eventListener(this.panelDockSide, "change", this.handlePanelDockSideChange.bind(this));
    this.eventListener(this.appearanceStyle, "change", this.handleStyleChange.bind(this));
    
    const orderFieldset = this.querySelector(".group-settings__order");
    const setOrderButton = this.querySelector(".group-settings__set-order");
    if (orderFieldset && setOrderButton) {
      this.eventListener(setOrderButton, "click", () => {
        const memberOrder = Array.from(this.memberSection.querySelectorAll("li"))
          .map(item => item.dataset.name);
        console.log("Setting member order:", memberOrder);
        localStorage.setItem("memberOrder", JSON.stringify(memberOrder));
        window.location.reload();
      });

      const storedMemberOrder = JSON.parse(localStorage.getItem("memberOrder") || "[]");
      if (storedMemberOrder.length > 0) {
        this.renderMemberList(storedMemberOrder);
      }
    }
  }

  renderMemberList(memberOrder) {
    this.memberSection.innerHTML = "";
    const fragment = document.createDocumentFragment();
    memberOrder.forEach(name => {
      const li = document.createElement("li");
      li.dataset.name = name;
      li.draggable = true;

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = true;
      checkbox.addEventListener("change", () => {
        li.style.display = checkbox.checked ? "block" : "none";
      });

      const label = document.createElement("label");
      label.textContent = name;

      li.appendChild(checkbox);
      li.appendChild(label);

      li.addEventListener("dragstart", this.handleDragStart.bind(this));
      li.addEventListener("dragover", this.handleDragOver.bind(this));
      li.addEventListener("drop", this.handleDrop.bind(this));
      fragment.appendChild(li);
    });
    this.memberSection.appendChild(fragment);
  }

  handleDragStart(event) {
    event.dataTransfer.setData("text/plain", event.target.dataset.name);
  }

  handleDragOver(event) {
    event.preventDefault();
  }

  handleDrop(event) {
    event.preventDefault();
    const draggedName = event.dataTransfer.getData("text/plain");
    const targetName = event.target.dataset.name;

    const items = Array.from(this.memberSection.querySelectorAll("li"));
    const draggedIndex = items.findIndex(item => item.dataset.name === draggedName);
    const targetIndex = items.findIndex(item => item.dataset.name === targetName);

    if (draggedIndex !== -1 && targetIndex !== -1) {
      const [draggedItem] = items.splice(draggedIndex, 1);
      items.splice(targetIndex, 0, draggedItem);

      this.memberSection.innerHTML = "";
      items.forEach(item => this.memberSection.appendChild(item));
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  handleStyleChange() {
    const style = this.querySelector(`input[name="appearance-style"]:checked`).value;
    appearance.setTheme(style);
  }

  handlePanelDockSideChange() {
    const side = this.querySelector(`input[name="panel-dock-side"]:checked`).value;

    if (side === "right") {
      appearance.setLayout("row-reverse");
    } else {
      appearance.setLayout("row");
    }
  }

  handleUpdatedMembers(members) {
    members = members.filter((member) => member.name !== "@SHARED");
    const memberNames = members.map(member => member.name);
    this.renderMemberList(memberNames);
  }
}

customElements.define("group-settings", GroupSettings);