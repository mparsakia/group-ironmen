import { BaseElement } from "../base-element/base-element";
import { appearance } from "../appearance";

export class GroupSettings extends BaseElement {
  constructor() {
    super();
  }

  html() {
    const selectedPanelDockSide = appearance.getLayout();
    const style = appearance.getTheme();
    return `{{group-settings.html}}`;
  }

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
    this.loadMemberOrder();
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

  loadMemberOrder() {
    console.log('loading member order');
    this.membersList.innerHTML = ''; // Clear existing content

    // Create table elements
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');
    table.appendChild(thead);
    table.appendChild(tbody);

    // Create header row
    const headerRow = document.createElement('tr');
    const headerCellName = document.createElement('th');
    headerCellName.textContent = 'Player Names';
    headerRow.appendChild(headerCellName);

    const headerCellActions = document.createElement('th');
    headerCellActions.textContent = 'Actions';
    headerRow.appendChild(headerCellActions);

    thead.appendChild(headerRow);

    // Assuming 'memberOrder' contains the list of player names
    const memberOrder = JSON.parse(localStorage.getItem('memberOrder')) || [];
    memberOrder.forEach((memberName, index) => {
      const row = document.createElement('tr');
      const cellName = document.createElement('td');
      cellName.textContent = memberName;
      row.appendChild(cellName);

      // Actions cell
      const cellActions = document.createElement('td');
      const upButton = document.createElement('button');
      upButton.textContent = 'Up';
      upButton.onclick = () => this.moveMember(memberName, -1);
      const downButton = document.createElement('button');
      downButton.textContent = 'Down';
      downButton.onclick = () => this.moveMember(memberName, 1);

      // Disable up button for the first item and down button for the last item
      if (index === 0) upButton.disabled = true;
      if (index === memberOrder.length - 1) downButton.disabled = true;

      cellActions.appendChild(upButton);
      cellActions.appendChild(downButton);
      row.appendChild(cellActions);

      tbody.appendChild(row);
    });

    // Append the table to the members list
    this.membersList.appendChild(table);
  }

  moveMember(memberName, direction) {
    const memberOrder = JSON.parse(localStorage.getItem('memberOrder')) || [];
    const index = memberOrder.indexOf(memberName);
    if (index > -1) {
      const newIndex = index + direction;
      if (newIndex >= 0 && newIndex < memberOrder.length) {
        memberOrder.splice(index, 1);
        memberOrder.splice(newIndex, 0, memberName);
        localStorage.setItem('memberOrder', JSON.stringify(memberOrder));
        this.loadMemberOrder();
      }
    }
  }
}

customElements.define("group-settings", GroupSettings);
