import { describe, expect, it } from "vitest";
import { GroupData } from "../src/data/group-data";
import { SkillName } from "../src/data/skill";
import { Quest } from "../src/data/quest";

describe("group-data", () => {
  it("transforms packed item data from storage", () => {
    expect(GroupData.transformItemsFromStorage([4151, 2, 995, 100])).toEqual([
      { id: 4151, quantity: 2 },
      { id: 995, quantity: 100 },
    ]);
  });

  it("transforms packed skill data and computes overall", () => {
    const skillNames = Object.keys(SkillName).filter((name) => name !== SkillName.Overall);
    const packedSkills = skillNames.map((_, index) => index + 1);

    const result = GroupData.transformSkillsFromStorage(packedSkills);

    expect(result[skillNames[0]]).toBe(1);
    expect(result[SkillName.Overall]).toBe(
      packedSkills.reduce((sum, xp) => sum + xp, 0),
    );
  });

  it("transforms packed stats and coordinates", () => {
    expect(GroupData.transformStatsFromStorage([50, 99, 25, 70, 3500, 0, 328])).toEqual({
      hitpoints: { current: 50, max: 99 },
      prayer: { current: 25, max: 70 },
      energy: { current: 3500, max: 10000 },
      world: 328,
    });

    expect(GroupData.transformCoordinatesFromStorage([3200, 3200, 1])).toEqual({
      x: 3200,
      y: 3201,
      plane: 1,
    });
  });

  it("maps quest indexes to quest states", () => {
    Quest.questIds = [100, 101, 102];

    expect(GroupData.transformQuestsFromStorage([0, 2, 1])).toEqual({
      100: "IN_PROGRESS",
      101: "FINISHED",
      102: "NOT_STARTED",
    });
  });

  it("applies text filters with exact, partial, and id matching", () => {
    const data = new GroupData();
    data.groupItems = {
      1: { id: 1, name: "Rune scimitar", quantities: { Alice: 1 }, visible: false },
      2: { id: 2, name: "Dragon dagger", quantities: { Alice: 1 }, visible: false },
      4151: { id: 4151, name: "Abyssal whip", quantities: { Alice: 1 }, visible: false },
    };

    data.applyTextFilter("rune|\"dragon dagger\"|4151");

    expect(data.groupItems[1].visible).toBe(true);
    expect(data.groupItems[2].visible).toBe(true);
    expect(data.groupItems[4151].visible).toBe(true);

    data.applyTextFilter("\"dragon dagger\"");

    expect(data.groupItems[1].visible).toBe(false);
    expect(data.groupItems[2].visible).toBe(true);
    expect(data.groupItems[4151].visible).toBe(false);
  });
});
