import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { ref } from "vue";
import Navbar from "@/components/Navbar.vue";
const { push, toggleTheme } = vi.hoisted(() => ({
  push: vi.fn(),
  toggleTheme: vi.fn(),
}));

vi.mock("vue-router", async (importOriginal) => ({
  ...(await importOriginal()),
  useRouter: () => ({ push }),
}));

vi.mock("@/composables/useTheme", () => ({
  useTheme: () => ({ isDarkMode: ref(false), toggleTheme }),
}));

const RouterLinkStub = {
  props: ["to"],
  template: '<a :href="to"><slot /></a>',
};

function mountNavbar(props = {}) {
  return mount(Navbar, {
    props,
    global: { stubs: { RouterLink: RouterLinkStub } },
  });
}

describe("Navbar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows the CoinTracker logo linking to home", () => {
    const wrapper = mountNavbar();
    const logo = wrapper.findComponent(RouterLinkStub);

    expect(logo.text()).toContain("CoinTracker");
    expect(logo.props("to")).toBe("/");
  });

  it("scrolls to top when the logo is clicked", async () => {
    const scrollSpy = vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    const wrapper = mountNavbar();

    await wrapper.findComponent(RouterLinkStub).trigger("click");

    expect(scrollSpy).toHaveBeenCalledWith(0, 0);
  });

  it("calls toggleTheme when the dark mode checkbox changes", async () => {
    const wrapper = mountNavbar();

    await wrapper.find('input[type="checkbox"]').trigger("change");

    expect(toggleTheme).toHaveBeenCalledTimes(1);
  });

  it("navigates when a service is selected, then resets the select", async () => {
    const wrapper = mountNavbar();
    const select = wrapper.find("select");

    await select.setValue("/compare-coins");

    expect(push).toHaveBeenCalledWith("/compare-coins");
    expect(select.element.value).toBe("");
  });

  it("does not navigate when the empty option is chosen", async () => {
    const wrapper = mountNavbar();

    await wrapper.find("select").setValue("");

    expect(push).not.toHaveBeenCalled();
  });

  it("shows the modelValue inside the search input", () => {
    const wrapper = mountNavbar({ modelValue: "bitcoin" });

    expect(wrapper.find('input[type="text"]').element.value).toBe("bitcoin");
  });

  it("emits update:modelValue when the user types in search", async () => {
    const wrapper = mountNavbar();

    await wrapper.find('input[type="text"]').setValue("eth");

    expect(wrapper.emitted("update:modelValue")[0]).toEqual(["eth"]);
  });
});
