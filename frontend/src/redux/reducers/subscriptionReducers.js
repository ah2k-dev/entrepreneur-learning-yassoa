import { subscriptionConstants } from "../constants/subscriptionConstants";
export const subscriptionReducer = (
    state = {
        plansList: [],
        plansListLoading: false,
        paymentMethodsList: [],
        paymentMethodsListLoading: false,
        subscriptionCheckoutLoading: false,
        mySubscription: null,
        mySubscriptionLoading: false
    },
    action
) => {
    switch (action.type) {
        // GET_PLANS list 
        case subscriptionConstants.GET_PLANS_REQUEST:
            return {
                ...state,
                plansListLoading: true,
            };
        case subscriptionConstants.GET_PLANS_SUCCESS:
            return {
                ...state,
                plansList: action.payload,
                plansListLoading: false,
            };
        case subscriptionConstants.GET_PLANS_FAILURE:
            return {
                ...state,
                plansListLoading: false,
            };

        //Add Payment Methods
        case subscriptionConstants.ADD_PAYMENT_METHOD_REQUEST:
            return {
                ...state,
                subscriptionCheckoutLoading: true,
            };
        case subscriptionConstants.ADD_PAYMENT_METHOD_SUCCESS:
            return {
                ...state,
                subscriptionCheckoutLoading: false,
            };
        case subscriptionConstants.ADD_PAYMENT_METHOD_FAILURE:
            return {
                ...state,
                subscriptionCheckoutLoading: false,
            };

        //Delete Payment Methods
        case subscriptionConstants.REMOVE_PAYMENT_METHOD_REQUEST:
            return {
                ...state,
                paymentMethodsListLoading: true,
            };
        case subscriptionConstants.REMOVE_PAYMENT_METHOD_SUCCESS:
            const { paymentMethodsList } = state
            const id = action.payload;
            const newPaymentMethodsList = paymentMethodsList.filter((item) => item.id != id)
            return {
                ...state,
                paymentMethodsListLoading: false,
                paymentMethodsList: newPaymentMethodsList
            };
        case subscriptionConstants.REMOVE_PAYMENT_METHOD_FAILURE:
            return {
                ...state,
                paymentMethodsListLoading: false,
            };

        //Create Subscription
        case subscriptionConstants.CREATE_SUBSCRIPTION_REQUEST:
            return {
                ...state,
                subscriptionCheckoutLoading: true,
            };
        case subscriptionConstants.CREATE_SUBSCRIPTION_SUCCESS:
            return {
                ...state,
                subscriptionCheckoutLoading: false,
            };
        case subscriptionConstants.CREATE_SUBSCRIPTION_FAILURE:
            return {
                ...state,
                subscriptionCheckoutLoading: false,
            };

        //Get Payment Methods
        case subscriptionConstants.GET_PAYMENT_METHODS_REQUEST:
            return {
                ...state,
                paymentMethodsListLoading: true,
            };
        case subscriptionConstants.GET_PAYMENT_METHODS_SUCCESS:
            return {
                ...state,
                paymentMethodsListLoading: false,
                paymentMethodsList: action.payload,
            };
        case subscriptionConstants.GET_PAYMENT_METHODS_FAILURE:
            return {
                ...state,
                paymentMethodsListLoading: false,
            };

        //Get Payment Methods
        case subscriptionConstants.GET_MY_SUBSCRIPTION_REQUEST:
            return {
                ...state,
                mySubscriptionLoading: true
            };
        case subscriptionConstants.GET_MY_SUBSCRIPTION_SUCCESS:
            return {
                ...state,
                mySubscription: action.payload,
                mySubscriptionLoading: false
            };
        case subscriptionConstants.GET_MY_SUBSCRIPTION_FAILURE:
            return {
                ...state,
                mySubscriptionLoading: false
            };


        default: // ? defaaaalt case yk...!
            return state;
    }
};
