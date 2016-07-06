define(["moment"], function  (m) {
    return typeof(moment) === 'undefined' ? window.moment = m : moment;
});