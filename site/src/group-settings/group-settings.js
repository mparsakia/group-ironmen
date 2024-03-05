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
    
    const orderFieldset = this.querySelector(".group-settings__order");
    const memberOrderInput = this.querySelector(".group-settings__member-order");
    const setOrderButton = this.querySelector(".group-settings__set-order");
    if(orderFieldset && memberOrderInput && setOrderButton) {
      this.eventListener(setOrderButton, "click", () => {
        const memberOrder = memberOrderInput.value.split(",") || [];
        console.log("Setting member order:", memberOrder);
        localStorage.setItem("memberOrder", JSON.stringify(memberOrder));
      });
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
