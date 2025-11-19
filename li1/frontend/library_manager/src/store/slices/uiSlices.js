// src/store/slices/uiSlice.js
import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    sidebarOpen: true,
    currentTheme: 'light',
    loading: false,
    modals: {
      createBook: false,
      createUser: false,
      // ... autres modals
    }
  },
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setTheme: (state, action) => {
      state.currentTheme = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    openModal: (state, action) => {
      state.modals[action.payload] = true;
    },
    closeModal: (state, action) => {
      state.modals[action.payload] = false;
    },
  },
});

export const { 
  toggleSidebar, 
  setTheme, 
  setLoading, 
  openModal, 
  closeModal 
} = uiSlice.actions;

export default uiSlice.reducer;