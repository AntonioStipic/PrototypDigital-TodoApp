import { takeLatest, put, call, fork, take, cancel } from "redux-saga/effects";

import firebaseSaga, { reduxSagaFirebase } from "../config/firebaseConfig";

import { randomHex } from "../functions/randomHex";
import { syncTodoAction } from "../actions/todoActions";

function* addTodoAsync(action: any) {

  yield call(reduxSagaFirebase.firestore.addDocument, "todos", {
    title: action.payload.title,
    body: action.payload.body,
    timestamp: Date.now().toString(),
    owner: action.payload.userId,
    id: randomHex(),
    finished: false
  });
}

function* updateTodoAsync(action: any) {
  yield call(
    reduxSagaFirebase.firestore.updateDocument,
    `todos/${action.payload.id}`,
    {
      title: action.payload.title,
      body: action.payload.body,
      finished: action.payload.finished
    }
  );
}

function* removeTodoAsync(action: any) {
  yield call(reduxSagaFirebase.firestore.deleteDocument, `todos/${action.payload.id}`);
}

function* signIn(action: any) {
  try {
    const auth = reduxSagaFirebase.auth;
    const result = yield call(
      [auth, auth.signInWithEmailAndPassword],
      action.payload.email,
      action.payload.password
    );

    if (!result.credential) {
      yield put({
        type: "SIGN_IN_SUCCESS_REDUCER",
        payload: {
          user: result.user,
          credential: JSON.stringify({
            withoutCredential: true,
            user: result.user
          })
        }
      });
    } else {
      yield put({
        type: "SIGN_IN_SUCCESS_REDUCER",
        payload: { user: result.user, credential: result.credential }
      });
    }

    // Start the sync saga
    const snapshot = yield reduxSagaFirebase.firestore.getCollection("todos");
    let task = yield fork(
      reduxSagaFirebase.firestore.syncCollection,
      snapshot.query.where("owner", "==", result.user.uid).orderBy("timestamp"),
      { successActionCreator: syncTodoAction }
    );

    // Wait for the logout action, then stop sync
    yield take("SIGN_OUT");
    yield cancel(task);
  } catch (error) {
    const error_message = { code: error.code, message: error.message };
    console.log(error);
    yield put({ type: "SIGN_IN_FAILED", payload: error_message });
  }
}

function* signInFacebook() {
  const authProvider = yield new firebaseSaga.auth.FacebookAuthProvider();

  try {
    const auth = firebaseSaga.auth();
    const result = yield call([auth, auth.signInWithPopup], authProvider);

    yield put({
      type: "SIGN_IN_SUCCESS_REDUCER",
      payload: { user: result.user, credential: result.credential }
    });

    // Start the sync saga
    const snapshot = yield reduxSagaFirebase.firestore.getCollection("todos");
    let task = yield fork(
      reduxSagaFirebase.firestore.syncCollection,
      snapshot.query.where("owner", "==", result.user.uid).orderBy("timestamp"),
      { successActionCreator: syncTodoAction }
    );

    // Wait for the logout action, then stop sync
    yield take("SIGN_OUT");
    yield cancel(task);
  } catch (error) {
    const error_message = { code: error.code, message: error.message };
    console.log(error);
    yield put({ type: "SIGN_IN_FAILED", payload: error_message });
  }
}

function* signInGoogle() {
  const authProvider = yield new firebaseSaga.auth.GoogleAuthProvider();

  try {
    const auth = firebaseSaga.auth();
    const result = yield call([auth, auth.signInWithPopup], authProvider);
    yield put({
      type: "SIGN_IN_SUCCESS_REDUCER",
      payload: { user: result.user, credential: result.credential }
    });

    // Start the sync saga
    const snapshot = yield reduxSagaFirebase.firestore.getCollection("todos");
    let task = yield fork(
      reduxSagaFirebase.firestore.syncCollection,
      snapshot.query.where("owner", "==", result.user.uid).orderBy("timestamp"),
      { successActionCreator: syncTodoAction }
    );

    // Wait for the logout action, then stop sync
    yield take("SIGN_OUT");
    yield cancel(task);
  } catch (error) {
    const error_message = { code: error.code, message: error.message };
    console.log(error);
    yield put({ type: "SIGN_IN_FAILED", payload: error_message });
  }
}

function* signOut(action: any) {
  try {
    const auth = reduxSagaFirebase.auth;
    yield call([auth, auth.signOut]);

    yield put({ type: "SIGN_OUT_SUCCESS" });
  } catch (error) {
    yield put({ type: "SIGN_OUT_FAILED" });
  }
}

function* signUp(action: any) {

  try {
    const user = yield call(reduxSagaFirebase.auth.createUserWithEmailAndPassword, action.payload.email, action.payload.password);

    yield put({
      type: "SIGN_IN_SUCCESS_REDUCER",
      payload: {
        user: user.user,
        credential: JSON.stringify({
          withoutCredential: true,
          user: user.user
        })
      }
    });
  }
  catch(error) {
    const error_message = { code: error.code, message: error.message };
    yield put({ type: "SIGN_UP_FAILED", payload: error_message });
  }

}

function* signInLocal(action: any) {
  yield put({ type: "TOGGLE_SHOW_LOGIN_LOADER" });
  let credentialObject =
    typeof action.payload.credential == "object"
      ? action.payload.credential
      : JSON.parse(action.payload.credential);

  if (credentialObject["withoutCredential"]) {
    try {
      yield put({
        type: "SIGN_IN_SUCCESS_REDUCER",
        payload: {
          user: credentialObject["user"],
          credential: credentialObject
        }
      });

      const snapshot = yield reduxSagaFirebase.firestore.getCollection("todos");
      let task = yield fork(
        reduxSagaFirebase.firestore.syncCollection,
        snapshot.query
          .where("owner", "==", credentialObject["user"].uid)
          .orderBy("timestamp"),
        { successActionCreator: syncTodoAction }
      );

      // Wait for the logout action, then stop sync
      yield take("SIGN_OUT");
      yield cancel(task);
    } catch (error) {
      const error_message = { code: error.code, message: error.message };
      console.log(error);
      yield put({ type: "SIGN_IN_FAILED", payload: error_message });
    }
  } else {
    try {
      const auth = firebaseSaga.auth();

      let credential: any = firebaseSaga.auth.AuthCredential.fromJSON(
        credentialObject
      );

      const result = yield call([auth, auth.signInWithCredential], credential);

      yield put({
        type: "SIGN_IN_SUCCESS_REDUCER",
        payload: { user: result.user, credential: result.credential }
      });

      // Start the sync saga
      const snapshot = yield reduxSagaFirebase.firestore.getCollection("todos");
      let task = yield fork(
        reduxSagaFirebase.firestore.syncCollection,
        snapshot.query
          .where("owner", "==", result.user.uid)
          .orderBy("timestamp"),
        { successActionCreator: syncTodoAction }
      );

      // Wait for the logout action, then stop sync
      yield take("SIGN_OUT");
      yield cancel(task);
    } catch (error) {
      const error_message = { code: error.code, message: error.message };
      console.log(error);
      yield put({ type: "SIGN_IN_FAILED", payload: error_message });
    }
  }
}

export function* watchMiddleware(dispatch: any, getState: any) {
  // Auth
  yield takeLatest("SIGN_IN", signIn);
  yield takeLatest("SIGN_OUT", signOut);

  yield takeLatest("SIGN_UP", signUp);

  yield takeLatest("SIGN_IN_FACEBOOK", signInFacebook);
  yield takeLatest("SIGN_IN_GOOGLE", signInGoogle);

  yield takeLatest("SIGN_IN_LOCAL", signInLocal);

  // Todo
  yield takeLatest("ADD_TODO", addTodoAsync);
  yield takeLatest("UPDATE_TODO_BY_ID", updateTodoAsync);

  yield takeLatest("REMOVE_TODO_BY_ID", removeTodoAsync)
}
