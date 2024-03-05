class Storage {
  storeGroup(groupName, groupToken, memberNames) {
    localStorage.setItem("groupName", groupName);
    localStorage.setItem("groupToken", groupToken);
    localStorage.setItem("memberOrder", JSON.stringify(memberNames || []));
  }

  getGroup() {
    return {
      groupName: localStorage.getItem("groupName"),
      groupToken: localStorage.getItem("groupToken"),
      memberOrder: JSON.parse(localStorage.getItem("memberOrder")) || [],
    };
  }

  clearGroup() {
    localStorage.removeItem("groupName");
    localStorage.removeItem("groupToken");
    localStorage.removeItem("memberOrder");
  }
}

const storage = new Storage();

export { storage };
