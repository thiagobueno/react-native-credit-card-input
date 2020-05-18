import connectToState from "./connectToState";
import CCF from "./CreditCardInput";
import CV from "./CardView";

export const CreditCardInput = connectToState(CCF);
export const CardView = CV;
