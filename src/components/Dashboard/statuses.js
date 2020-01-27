export const statuses = {
    readyForCollection:{
        processed: 1010,
        reason: 'ready_for_collection'
    },
    waitDODToPickOrder: {
        processed: 1001,
        reason: 'awaiting DOD to pick up the order'
    },
    sendToPOS: {
        processed: 1112,
        reason: 'DOD send order to process but service did not pick this order yet'
    },
    acceptFromPOS: {
        processed: 1114,
        reason: 'Service is processing the order.'
    },
    requestSend: {
        processed: 2000,
        reason: 'request send'
    },
    storeClose: {
        processed: 1008,
        reason: 'order cancelled'
    },
    cancel: {
        processed: 1015,
        reason: 'order cancelled'
    },
    unableToConnect: {
        processed: 1012,
        reason: 'retry'
    },
    myCentralFail: {
        processed: 1011,
        reason: 'retry'
    },
    unknown: {
        processed: 1014,
        reason: 'retry'
    },
    posErrorAccess: {
        processed: 1016,
        reason: 'retry'
    },
    posErrorNoEndPoint: {
        processed: 1017,
        reason: 'retry'
    },
    orderCancel: {
        processed: 1019,
        reason: 'retry'
    },
    orderCancellationProcessed: {
        processed: 2001,
        reason: 'order cancel'
    }
};
