/*
  Functions located here are involved with the store state
*/
import { STATE } from "../Components/Constants/index";

// Function will load the current state from local storage
export const loadState = () => {
  try {
    const serializedState = localStorage.getItem(STATE);
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.log(err);
    return undefined;
  }
};

// Function will save the current redux state into local storage
export const saveState = state => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(STATE, serializedState);
  } catch (err) {
    console.log(err);
  }
};

/* Function will remove the state from the local storage.
 to be used with logout action and authenicate removetoken
 https://html.spec.whatwg.org/multipage/webstorage.html
 */
export const removeState = state => {
  localStorage.removeItem(STATE);
};
