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
    // Load and apply saved panel order
    const savedOrder = JSON.parse(localStorage.getItem('panelOrder'));
    if (savedOrder) {
        savedOrder.forEach(panelId => {
            const panel = this.sidePanels.querySelector(`#${panelId}`);
            if (panel) {
                this.sidePanels.appendChild(panel);
            }
        });
    }
    this.subscribe("members-updated", this.handleUpdatedMembers.bind(this));

    // Drag and Drop functionality
    let draggedItem = null;

    this.sidePanels.addEventListener('dragstart', (e) => {
        if (e.target.classList.contains("drag-handle")) {
            draggedItem = e.target.closest('.player-panel');
            setTimeout(() => draggedItem.style.opacity = "0.5", 0);
        }
    });

    this.sidePanels.addEventListener('dragend', (e) => {
        if (draggedItem) {
            setTimeout(() => {
                draggedItem.style.opacity = "";
                draggedItem = null;
            }, 0);
        }
    });

    this.sidePanels.addEventListener('dragover', (e) => {
        e.preventDefault();
    });

    this.sidePanels.addEventListener('drop', (e) => {
        e.preventDefault();
        const targetPanel = e.target.closest('.player-panel');
        if (targetPanel && draggedItem) {
            this.sidePanels.insertBefore(draggedItem, targetPanel.nextSibling);
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
      playerPanels += `<player-panel draggable="true" class="rsborder rsbackground" player-name="${member.name}"><div class="drag-handle">&plus;</div></player-panel>`;
    }

    this.sidePanels.innerHTML = playerPanels;
  }
}
customElements.define("side-panel", SidePanel);
