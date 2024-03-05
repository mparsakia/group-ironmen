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
    // Retrieve the member order, defaulting to the order in the members array if none is stored
    const memberOrder = JSON.parse(localStorage.getItem('memberOrder')) || members.map(member => member.name);
  
    // Filter out member names starting with "-" from memberOrder for rendering
    const filteredMemberOrder = memberOrder.filter(name => !name.startsWith("-"));
  
    // Iterate over the filtered member order to create the player panels
    filteredMemberOrder.forEach(memberName => {
      const member = members.find(m => m.name === memberName);
      if (member && member.name !== "@SHARED") {
        playerPanels += `<player-panel class="rsborder rsbackground" player-name="${member.name}"></player-panel>`;
      }
    });
  
    // For any remaining members (not in filteredMemberOrder and not prefixed with "-") add them after the ordered members
    members.forEach(member => {
      if (!filteredMemberOrder.includes(member.name) && member.name !== "@SHARED" && !memberOrder.includes("-" + member.name)) {
        playerPanels += `<player-panel class="rsborder rsbackground" player-name="${member.name}"></player-panel>`;
      }
    });
  
    this.sidePanels.innerHTML = playerPanels;
  }
}
customElements.define("side-panel", SidePanel);