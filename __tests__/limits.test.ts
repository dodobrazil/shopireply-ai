import {
  getRemainingGenerations,
  hasGenerationsLeft,
  getUsagePercentage,
  getPlanDisplayName,
  PLAN_LIMITS,
} from "../lib/utils/limits";

describe("Plan Limits Utilities", () => {
  describe("getRemainingGenerations", () => {
    it("returns correct remaining for free plan", () => {
      expect(getRemainingGenerations("free", 5)).toBe(5);
      expect(getRemainingGenerations("free", 10)).toBe(0);
      expect(getRemainingGenerations("free", 0)).toBe(10);
    });

    it("returns correct remaining for starter plan", () => {
      expect(getRemainingGenerations("starter", 0)).toBe(500);
      expect(getRemainingGenerations("starter", 250)).toBe(250);
      expect(getRemainingGenerations("starter", 500)).toBe(0);
    });

    it("returns correct remaining for pro plan", () => {
      expect(getRemainingGenerations("pro", 0)).toBe(2000);
      expect(getRemainingGenerations("pro", 1000)).toBe(1000);
      expect(getRemainingGenerations("pro", 2000)).toBe(0);
    });

    it("does not return negative values", () => {
      expect(getRemainingGenerations("free", 100)).toBe(0);
      expect(getRemainingGenerations("starter", 1000)).toBe(0);
    });
  });

  describe("hasGenerationsLeft", () => {
    it("returns true when under limit", () => {
      expect(hasGenerationsLeft("free", 5)).toBe(true);
      expect(hasGenerationsLeft("starter", 499)).toBe(true);
      expect(hasGenerationsLeft("pro", 1999)).toBe(true);
    });

    it("returns false when at or over limit", () => {
      expect(hasGenerationsLeft("free", 10)).toBe(false);
      expect(hasGenerationsLeft("free", 11)).toBe(false);
      expect(hasGenerationsLeft("starter", 500)).toBe(false);
      expect(hasGenerationsLeft("pro", 2000)).toBe(false);
    });
  });

  describe("getUsagePercentage", () => {
    it("returns 0 for no usage", () => {
      expect(getUsagePercentage("free", 0)).toBe(0);
    });

    it("returns 50 for half usage", () => {
      expect(getUsagePercentage("free", 5)).toBe(50);
      expect(getUsagePercentage("starter", 250)).toBe(50);
      expect(getUsagePercentage("pro", 1000)).toBe(50);
    });

    it("returns 100 for full usage", () => {
      expect(getUsagePercentage("free", 10)).toBe(100);
      expect(getUsagePercentage("starter", 500)).toBe(100);
    });

    it("caps at 100 for over usage", () => {
      expect(getUsagePercentage("free", 100)).toBe(100);
    });
  });

  describe("getPlanDisplayName", () => {
    it("returns correct display names", () => {
      expect(getPlanDisplayName("free")).toBe("Free");
      expect(getPlanDisplayName("starter")).toBe("Starter");
      expect(getPlanDisplayName("pro")).toBe("Pro");
    });
  });

  describe("PLAN_LIMITS", () => {
    it("has correct limits", () => {
      expect(PLAN_LIMITS.free).toBe(10);
      expect(PLAN_LIMITS.starter).toBe(500);
      expect(PLAN_LIMITS.pro).toBe(2000);
    });
  });
});
