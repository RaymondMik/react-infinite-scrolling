import { call, put, takeLatest, select } from "redux-saga/effects";
import * as actions from "./actions";
import { getData, checkEndOfCatalogue } from "../services";
import { BATCH_SIZE, MAX_CATALOGUE_LENGTH } from "../constants";

function* fetchUsersSaga() {
  yield takeLatest(
    [actions.GET_USERS, actions.GET_NEXT_USERS_BATCH],
    function* ({ type }) {
      try {
         const { currentPage, isEndOfCatalogue } = yield select(state => state.users);
         const exceedsCatalogueLength = checkEndOfCatalogue(currentPage, BATCH_SIZE, MAX_CATALOGUE_LENGTH);

         if (isEndOfCatalogue) {
            return;
         }

         if (exceedsCatalogueLength) {
            const itemsReminder = MAX_CATALOGUE_LENGTH % BATCH_SIZE;
       
            // check if there are remaining items to fetch
            if (itemsReminder === 0) {
               yield put(actions.setEndOfCatalogue());
               return;
            }

            // fetch last batch of items
            const users = yield call(
               getData,
               `https://randomuser.me/api/?page=${currentPage}&results=${itemsReminder}`
            );

            yield put(actions.getUsersSuccess(users));
            yield put(actions.setEndOfCatalogue());

            return;
         }

        const users = yield call(
          getData,
          `https://randomuser.me/api/?page=${currentPage}&results=${BATCH_SIZE}`
        );

        if (type === actions.GET_USERS) {
          yield put(actions.getUsersSuccess(users));
        } else {
          yield put(actions.getNextUsersBatchSuccess(users));
        }

        if (type === actions.GET_USERS) {
          yield put(actions.getNextUsersBatch());
        }
      } catch (error) {
        if (type === actions.GET_USERS) {
          yield put(actions.getUsersFailure());
        } else {
          yield put(actions.getNextUsersBatchFailure());
        }
      }
    }
  );
}

export default fetchUsersSaga;
