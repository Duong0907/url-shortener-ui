import "@testing-library/jest-dom";

// jsdom has no PointerEvent; Base UI's switch dispatches one when clicked.
if (!window.PointerEvent) {
  window.PointerEvent = MouseEvent as unknown as typeof PointerEvent;
}
