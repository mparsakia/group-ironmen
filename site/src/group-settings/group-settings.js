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
    const memberOrderInput = this.querySelector(".group-settings__member-order");
    const setOrderButton = this.querySelector(".group-settings__set-order");
    if (orderFieldset && memberOrderInput && setOrderButton) {
      this.eventListener(setOrderButton, "click", () => {
        const memberOrder = memberOrderInput.value.split(",").map(item => item.trim()).filter(item => item) || [];
        console.log("Setting member order:", memberOrder);
        localStorage.setItem("memberOrder", JSON.stringify(memberOrder));
        window.location.reload();
      });

      const storedMemberOrder = JSON.parse(localStorage.getItem("memberOrder") || "[]");
      if (storedMemberOrder.length > 0) {
        memberOrderInput.value = storedMemberOrder.join(",");
        this.renderDragAndDropList(storedMemberOrder);
      }
    }
  }

  renderDragAndDropList(memberOrder) {
    const listContainer = document.createElement("div");
    listContainer.classList.add("draggable-member-list");

    memberOrder.forEach(name => {
      const item = document.createElement("div");
      item.style.display = "flex";
      item.style.alignItems = "center";
      item.style.marginBottom = "8px"; 
      item.style.padding = "8px"; 
      item.style.opacity = name.startsWith('-') ? "0.5" : "1"; 
      item.style.border = "1px solid #625b58"; 
      item.style.borderRadius = "8px"; 
      item.style.cursor = "move";
      item.dataset.name = name;
      item.textContent = name;
      item.draggable = true;

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = !name.startsWith('-');
      checkbox.addEventListener("change", () => {
        item.style.opacity = checkbox.checked ? "1" : "0.2";
        console.log(`Checkbox for ${name} is now ${checkbox.checked ? 'checked' : 'unchecked'}`);
      });


      item.appendChild(checkbox);
      item.addEventListener("dragstart", this.handleDragStart.bind(this));
      item.addEventListener("dragover", this.handleDragOver.bind(this));
      item.addEventListener("dragleave", this.handleDragLeave.bind(this));
      item.addEventListener("drop", this.handleDrop.bind(this));
      listContainer.appendChild(item);
    });

    const orderFieldset = this.querySelector(".group-settings__order");
    orderFieldset.appendChild(listContainer);
  }

  handleDragStart(event) {
    event.dataTransfer.setData("text/plain", event.target.dataset.name);
    console.log(`Dragging ${event.target.dataset.name}`);
  }

  handleDragOver(event) {
    event.preventDefault();
    const target = event.currentTarget;
    target.style.border = "2px dashed #000"; // Add dashed border to indicate drop zone
  }

  handleDragLeave(event) {
    const target = event.currentTarget;
    target.style.border = "1px solid gray"; // Reset border when leaving the drop zone
  }

  handleDrop(event) {
    event.preventDefault();
    const draggedName = event.dataTransfer.getData("text/plain");
    const targetName = event.target.dataset.name;

    const items = Array.from(this.querySelectorAll(".draggable-member-list > div"));
    const draggedIndex = items.findIndex(item => item.dataset.name === draggedName);
    const targetIndex = items.findIndex(item => item.dataset.name === targetName);

    if (draggedIndex !== -1 && targetIndex !== -1) {
      const [draggedItem] = items.splice(draggedIndex, 1);
      items.splice(targetIndex, 0, draggedItem);

      const listContainer = this.querySelector(".draggable-member-list");
      listContainer.innerHTML = "";
      items.forEach(item => listContainer.appendChild(item));

      // Update local storage with new order
      const newOrder = items.map(item => item.dataset.name);
      localStorage.setItem("memberOrder", JSON.stringify(newOrder));
      console.log(`Updated member order: ${newOrder}`);

      // Update the text input with the new order
      const memberOrderInput = this.querySelector(".group-settings__member-order");
      memberOrderInput.value = newOrder.join(",");
    }

    // Reset border after drop
    event.target.style.border = "1px solid gray";
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
    let memberEdits = document.createDocumentFragment();
    for (let i = 0; i < members.length; ++i) {
      const member = members[i];
      const memberEdit = document.createElement("edit-member");
      memberEdit.member = member;
      memberEdit.memberNumber = i + 1;

      memberEdits.appendChild(memberEdit);
    }

    if (members.length < 12 ) {
      const addMember = document.createElement("edit-member");
      addMember.memberNumber = members.length + 1;
      memberEdits.appendChild(addMember);
    }

    this.memberSection.innerHTML = "";
    this.memberSection.appendChild(memberEdits);
  }
}

customElements.define("group-settings", GroupSettings);