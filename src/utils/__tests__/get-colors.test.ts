import { describe, it, expect } from "vitest";
import { getStatusColor } from "../get-colors";

describe("getStatusColor", () => {
  it("returns correct colors for Idle status", () => {
    const colors = getStatusColor("Idle");
    expect(colors.bg).toBe("green.100");
    expect(colors.color).toBe("green.800");
    expect(colors.bgDark).toBe("green.800");
    expect(colors.colorDark).toBe("green.200");
  });

  it("returns correct colors for On Delivery status", () => {
    const colors = getStatusColor("On Delivery");
    expect(colors.bg).toBe("blue.100");
    expect(colors.color).toBe("blue.800");
    expect(colors.bgDark).toBe("blue.800");
    expect(colors.colorDark).toBe("blue.200");
  });

  it("returns correct colors for Error status", () => {
    const colors = getStatusColor("Error");
    expect(colors.bg).toBe("red.100");
    expect(colors.color).toBe("red.800");
    expect(colors.bgDark).toBe("red.800");
    expect(colors.colorDark).toBe("red.200");
  });

  it("returns correct colors for Charging status", () => {
    const colors = getStatusColor("Charging");
    expect(colors.bg).toBe("purple.100");
    expect(colors.color).toBe("purple.800");
    expect(colors.bgDark).toBe("purple.800");
    expect(colors.colorDark).toBe("purple.200");
  });

  it("returns correct colors for Returning status", () => {
    const colors = getStatusColor("Returning");
    expect(colors.bg).toBe("orange.100");
    expect(colors.color).toBe("orange.800");
    expect(colors.bgDark).toBe("orange.800");
    expect(colors.colorDark).toBe("orange.200");
  });
});
