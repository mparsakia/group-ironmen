import { BaseElement } from "../base-element/base-element";

export class SidePanel extends BaseElement {
  constructor() {
    super();
  }

  html() {
    return `{{side-panel.html}}`;
  }

  connectedCallback() {
    super.connectedCallback();
    this.render();
    this.sidePanels = this.querySelector(".side-panel__panels");
    this.subscribe("members-updated", this.handleUpdatedMembers.bind(this));

    // Drag and Drop functionality
    let draggedItem = null;

    this.sidePanels.addEventListener('dragstart', (e) => {
        draggedItem = e.target;
        setTimeout(() => e.target.style.opacity = "0.5", 0);
    });

    this.sidePanels.addEventListener('dragend', (e) => {
        setTimeout(() => {
            draggedItem.style.opacity = "";
            draggedItem = null;
        }, 0);
    });

    this.sidePanels.addEventListener('dragover', (e) => {
        e.preventDefault();
    });

    this.sidePanels.addEventListener('drop', (e) => {
        e.preventDefault();
        if (e.target.classList.contains("player-panel")) {
            this.sidePanels.insertBefore(draggedItem, e.target.nextSibling);
            // Update order in localStorage
            const order = Array.from(this.sidePanels.children).map(panel => panel.id);
            localStorage.setItem('panelOrder', JSON.stringify(order));
        }
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  handleUpdatedMembers(members) {
    let playerPanels = "";
    for (const member of members) {
      if (member.name === "@SHARED") {
        continue;
      }
      playerPanels += `<player-panel class="rsborder rsbackground" player-name="${member.name}"></player-panel>`;
    }

    this.sidePanels.innerHTML = playerPanels;
  }
}
customElements.define("side-panel", SidePanel);
