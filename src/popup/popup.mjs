import amenities from "../amenities.json";

const screens = {
  HELLO: "hello",
  FILTERS: "filters",
};

const elements = {
  screens: Object.fromEntries(
    Object.values(screens).map((key) => [
      key,
      document.getElementById(`screen-${key}`),
    ]),
  ),
  amenitiesList: document.getElementById("amenities-list"),
};

const setScreen = (screenId) => {
  Object.values(screens).forEach((key) => {
    elements.screens[key].dataset.active = key === screenId;
  });
};

(async () => {
  Object.entries(amenities).forEach(([id, name]) => {
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.name = `amenities-${id}`;

    const label = document.createElement("label");
    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(name));

    const li = document.createElement("li");
    li.appendChild(label);

    elements.amenitiesList.appendChild(li);
  });

  const tabs = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true,
  });

  const isAirbnbPage = tabs[0]?.url.startsWith("https://www.airbnb.com/");

  setScreen(isAirbnbPage ? screens.FILTERS : screens.HELLO);
})();
