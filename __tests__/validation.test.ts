function isValidImdbId(value: string) {
  return /^tt\d{7,8}$/.test(value);
}

test("valid IMDb ID should return true", () => {
  expect(isValidImdbId("tt0133093")).toBe(true);
});

test("invalid IMDb ID should return false", () => {
  expect(isValidImdbId("abc123")).toBe(false);
});