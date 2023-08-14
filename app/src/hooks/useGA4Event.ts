export const useGA4Event = () => {
  const sendEvent = (eventName: string, eventParams: object) => {
    // @ts-ignore
    window.dataLayer = window.dataLayer || [];
    // @ts-ignore
    window.dataLayer.push({
      event: eventName,
      ...eventParams,
    });
  };
  return { sendEvent };
};
