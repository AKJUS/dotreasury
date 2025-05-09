import { createSlice, createSelector } from "@reduxjs/toolkit";
import api from "../../services/scanApi";
import { getTipCountdown } from "../../services/chainApi";
import { EMPTY_TABLE_DATA, tipStatusMap } from "../../constants";

const tipSlice = createSlice({
  name: "tips",
  initialState: {
    tips: {
      items: [],
      page: 0,
      pageSize: 10,
      total: 0,
    },
    loading: false,
    tipDetail: {},
    loadingTipDetail: false,
    tipCountdown: 14400,
  },
  reducers: {
    setTips(state, { payload }) {
      state.tips = payload;
    },
    setLoading(state, { payload }) {
      state.loading = payload;
    },
    setTipDetail(state, { payload }) {
      state.tipDetail = payload;
    },
    setLoadingTipDetail(state, { payload }) {
      state.loadingTipDetail = payload;
    },
    setTipCountdown(state, { payload }) {
      state.tipCountdown = payload;
    },
  },
});

export const {
  setTips,
  setLoading,
  setTipDetail,
  setLoadingTipDetail,
  setTipCountdown,
} = tipSlice.actions;

export const fetchTips =
  (page = 0, pageSize = 30, params, options = {}) =>
  async (dispatch) => {
    dispatch(setLoading(true));

    try {
      const { result } = await api.fetch(
        "/tips",
        {
          page,
          pageSize,
          ...params,
        },
        options,
      );
      dispatch(setTips(result || {}));
    } finally {
      dispatch(setLoading(false));
    }
  };
export const resetTips = () => (dispatch) => {
  dispatch(setTips(EMPTY_TABLE_DATA));
};

export const fetchTipDetail = (tipId) => async (dispatch) => {
  dispatch(setLoadingTipDetail(true));
  try {
    const { result } = await api.fetch(`/tips/${tipId}`);
    dispatch(setTipDetail(result || {}));
  } finally {
    dispatch(setLoadingTipDetail(false));
  }
};

export const fetchTipCountdown = () => async (dispatch, getState) => {
  const { chain } = getState();
  const tipCountdown = await getTipCountdown(chain.chain);
  dispatch(setTipCountdown(tipCountdown || 14400));
};

const tipFinalStates = ["TipRetracted", "TipClosed", "TipSlashed", "Removed"];
const showStatusMap = tipStatusMap;

export function normalizeTip(tip) {
  const showTime = tipFinalStates.includes(tip.latestState?.state);
  const showStatus = showStatusMap[tip.latestState?.state];

  return {
    showTime,
    showStatus,
    ...tip,
  };
}

export const tipListSelector = (state) => state.tips.tips;
export const normalizedTipListSelector = createSelector(
  tipListSelector,
  (tips) => {
    const items = tips?.items?.map(normalizeTip);
    return {
      ...tips,
      items,
    };
  },
);
export const loadingSelector = (state) => state.tips.loading;
export const tipDetailSelector = (state) => state.tips.tipDetail;
export const normalizedTipDetailSelector = createSelector(
  tipDetailSelector,
  (tip) => ({
    ...tip,
    ...normalizeTip(tip),
  }),
);
export const loadingTipDetailSelector = (state) => state.tips.loadingTipDetail;
export const tipCountdownSelector = (state) => state.tips.tipCountdown;
export const tipFindersFeeSelector = (state) =>
  state.tips.tipDetail.tipFindersFee;

export default tipSlice.reducer;
