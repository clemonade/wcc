import { UrlIdPipe } from "./urlId.pipe";

describe("urlIdPipe", () => {
  it("create an instance", () => {
    const pipe = new UrlIdPipe();
    expect(pipe).toBeTruthy();
  });
});
