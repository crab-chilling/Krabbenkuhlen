import {
  ADD_INVENTORY_CARD,
  UPDATE_INVENTORY_CARD,
  DELETE_INVENTORY_CARD,
  SET_INVENTORY_CARDS,
} from "../actions/inventory.actions";

const initialState = {
  cards: [],
};

const inventoryReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case SET_INVENTORY_CARDS:
      return {
        ...state,
        cards: action.payload,
      };

    case ADD_INVENTORY_CARD:
      return {
        ...state,
        cards: [...state.cards, action.payload],
      };

    case UPDATE_INVENTORY_CARD:
      return {
        ...state,
        cards: state.cards.map((card: any) =>
          card.id === action.payload.id ? action.payload : card,
        ),
      };

    case DELETE_INVENTORY_CARD:
      return {
        ...state,
        cards: state.cards.filter((card: any) => card.id !== action.payload),
      };

    default:
      return state;
  }
};

export default inventoryReducer;
