import { registerActionAsCommand } from "./runCommand";
import { createElement } from "../elements";
import { fetchCommandsRequest } from "../requests";

export const Actions = {
  CREATE_ELEMENT: "CREATE_ELEMENT",
  NEW_DRAWING: "NEW_DRAWING",
  DRAG_START: "DRAG_START",
  DRAG_FINISH: "DRAG_FINISH",
  SET_TOOL: "SET_TOOL",
  UNDO: "UNDO",
  REDO: "REDO",
  DELETE_ELEMENT: "DELETE_ELEMENT",
  MOVE_ELEMENT: "MOVE_ELEMENT",
  //REQUEST_COMMANDS: "REQUEST_COMMANDS",
  RECEIVE_COMMANDS: "RECEIVE_COMMANDS",
};

let nextElementId = 0;
export const createElementAction = (payload) => ({
  type: Actions.CREATE_ELEMENT,
  payload: { ...payload, id: nextElementId++ },
});

registerActionAsCommand(Actions.CREATE_ELEMENT, (action, elements) => {
  elements.set(action.payload.id, createElement(
    action.payload.type,
    action.payload
  ));
});

export const dragStart = (payload) => ({
  type: Actions.DRAG_START,
  payload,
});

export const dragFinish = () => ({
  type: Actions.DRAG_FINISH,
});

export const newDrawing = () => ({
  type: Actions.NEW_DRAWING,
});

export const setTool = (payload) => ({
  type: Actions.SET_TOOL,
  payload,
});

export const undo = () => ({
  type: Actions.UNDO,
});

export const redo = () => ({
  type: Actions.REDO,
});

export const deleteElementAction = (id) => ({
  type: Actions.DELETE_ELEMENT,
  id: id,
});

registerActionAsCommand(Actions.DELETE_ELEMENT, (action, elements) => {
  elements.delete(action.id);
});

export const moveElementAction = (payload) => ({
  type: Actions.MOVE_ELEMENT,
  payload: payload,
});

registerActionAsCommand(Actions.MOVE_ELEMENT, (action, elements) => {
  const element = elements.get(action.payload.id);
  element.start = action.payload.p1;
  element.end = action.payload.p2;
  
  elements.delete(action.payload.id);
  elements.set(action.payload.id, element);
});

export const receiveCommands = (payload) => ({
  type: Actions.RECEIVE_COMMANDS,
  payload: payload
});

export const fetchCommands = () => {
  return dispatch => {
    return fetchCommandsRequest()
      .then(response => response.json())
      .then(data => dispatch(receiveCommands(JSON.parse(data))))
  }
}