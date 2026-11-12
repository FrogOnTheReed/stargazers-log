const list = document.querySelector("#starred");
const status = document.querySelector("#status");

if (!list || !status) {
  throw new Error("Required UI elements are missing.");
}

function setStatus(message, isError = false) {
  status.textContent = message;
  status.hidden = !message;
  status.dataset.state = isError ? "error" : "success";
}

function renderEvents(events) {
  list.innerHTML = "";

  if (!Array.isArray(events)) {
    setStatus("No starred repositories were found.");
    return;
  }

  const validEvents = events.filter(
    (event) =>
      event &&
      typeof event === "object" &&
      typeof event.name === "string" &&
      event.name.trim() &&
      typeof event.starred === "string" &&
      event.starred.trim()
  );

  if (validEvents.length === 0) {
    setStatus("No starred repositories found.");
    return;
  }

  validEvents.forEach((event) => {
    const item = document.createElement("li");
    item.textContent = `${event.name.trim()} — starred ${event.starred.trim()}`;
    list.appendChild(item);
  });

  setStatus(`Loaded ${validEvents.length} starred repositories.`);
}

setStatus("Loading starred repositories...");

fetch("events.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Unable to load events (${response.status})`);
    }

    return response.json();
  })
  .then((events) => {
    renderEvents(events);
  })
  .catch((error) => {
    list.innerHTML = "";
    setStatus("Unable to load starred repositories right now.", true);
    console.error("Error loading starred repositories:", error);
  });