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
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  handleUpdatedMembers(members) {
    let playerPanels = "";
    const memberOrder = JSON.parse(localStorage.getItem('memberOrder')) || members.map(member => member.name);

    // Iterate over the member order to create the player panels in order from the memberOrder
    memberOrder.forEach(memberName => {
      const member = members.find(m => m.name === memberName);
      if (member && member.name !== "@SHARED") {
        playerPanels += `<player-panel class="rsborder rsbackground" player-name="${member.name}"></player-panel>`;
      }
    });

    // for any remaining members (not in memberOrder) add after the ordered members
    members.forEach(member => {
      if (!memberOrder.includes(member.name) && member.name !== "@SHARED") {
        playerPanels += `<player-panel class="rsborder rsbackground" player-name="${member.name}"></player-panel>`;
      }
    });

    this.sidePanels.innerHTML = playerPanels;
  }
}
customElements.define("side-panel", SidePanel);