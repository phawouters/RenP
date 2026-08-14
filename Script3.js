// JavaScript source code

document.addEventListener("DOMContentLoaded", function () {
    // TweePutten.html: "bob" is a text input (so it can show a trailing sign)
    // that behaves like a numeric stepper. It always displays 2 decimals with
    // the sign shown AFTER the number, e.g. "3.56 -", "2.35 +", or plain "0.00"
    // for exactly zero. Arrow Up/Down keys increment/decrement by data-step,
    // clamped between data-min and data-max.
    var setupBobStepper = function (inputId, upId, downId) {
        var bob = document.getElementById(inputId);

        if (bob) {
            var min = parseFloat(bob.dataset.min);
            var max = parseFloat(bob.dataset.max);
            var step = parseFloat(bob.dataset.step);

            var parseBobValue = function () {
                var raw = bob.value.replace(",", ".");
                var isNegative = raw.indexOf("-") !== -1;
                var numeric = raw.replace(/[^0-9.]/g, "");
                var value = parseFloat(numeric);

                if (isNaN(value)) {
                    value = 0;
                }

                return isNegative ? -Math.abs(value) : value;
            };

            var formatBob = function (value) {
                var clamped = Math.min(max, Math.max(min, value));
                var rounded = parseFloat(clamped.toFixed(2));

                if (rounded > 0) {
                    bob.value = rounded.toFixed(2) + " +";
                } else if (rounded < 0) {
                    bob.value = Math.abs(rounded).toFixed(2) + " -";
                } else {
                    bob.value = "0.00";
                }

                return rounded;
            };

            formatBob(parseBobValue());

            bob.addEventListener("change", function () {
                formatBob(parseBobValue());
            });

            bob.addEventListener("keydown", function (event) {
                if (event.key === "ArrowUp" || event.key === "ArrowDown") {
                    event.preventDefault();
                    var current = parseBobValue();
                    var next = event.key === "ArrowUp" ? current + step : current - step;
                    formatBob(next);
                }
            });

            // Custom spinner arrows (▲/▼), since a text input has no native ones.
            // Clicking steps once; press-and-hold keeps repeating the step until released.
            var bobUp = document.getElementById(upId);
            var bobDown = document.getElementById(downId);
            var holdInterval = null;
            var holdTimeout = null;

            var stopHolding = function () {
                clearTimeout(holdTimeout);
                clearInterval(holdInterval);
                holdTimeout = null;
                holdInterval = null;
            };

            var startHolding = function (direction) {
                stopHolding();
                formatBob(parseBobValue() + direction * step);

                holdTimeout = setTimeout(function () {
                    holdInterval = setInterval(function () {
                        formatBob(parseBobValue() + direction * step);
                    }, 80);
                }, 400);
            };

            if (bobUp) {
                bobUp.addEventListener("mousedown", function () {
                    startHolding(1);
                });
            }

            if (bobDown) {
                bobDown.addEventListener("mousedown", function () {
                    startHolding(-1);
                });
            }

            document.addEventListener("mouseup", stopHolding);
            document.addEventListener("mouseleave", stopHolding);
        }
    };

    // TweePutten.html: whole-number stepper (no sign, no decimals). Always
    // displays at least 2 digits, zero-padded (e.g. "00", "05", "150").
    // Arrow Up/Down keys increment/decrement by data-step, clamped between
    // data-min and data-max.
    var setupCounterStepper = function (inputId, upId, downId) {
        var counter = document.getElementById(inputId);

        if (counter) {
            var min = parseInt(counter.dataset.min, 10);
            var max = parseInt(counter.dataset.max, 10);
            var step = parseInt(counter.dataset.step, 10);

            var parseCounterValue = function () {
                var numeric = counter.value.replace(/[^0-9]/g, "");
                var value = parseInt(numeric, 10);

                if (isNaN(value)) {
                    value = 0;
                }

                return value;
            };

            var formatCounter = function (value) {
                var clamped = Math.min(max, Math.max(min, value));
                counter.value = clamped.toString().padStart(2, "0");
                return clamped;
            };

            formatCounter(parseCounterValue());

            counter.addEventListener("change", function () {
                formatCounter(parseCounterValue());
            });

            counter.addEventListener("keydown", function (event) {
                if (event.key === "ArrowUp" || event.key === "ArrowDown") {
                    event.preventDefault();
                    var current = parseCounterValue();
                    var next = event.key === "ArrowUp" ? current + step : current - step;
                    formatCounter(next);
                }
            });

            // Custom spinner arrows (▲/▼), since a text input has no native ones.
            // Clicking steps once; press-and-hold keeps repeating the step until released.
            var counterUp = document.getElementById(upId);
            var counterDown = document.getElementById(downId);
            var holdInterval = null;
            var holdTimeout = null;

            var stopHolding = function () {
                clearTimeout(holdTimeout);
                clearInterval(holdInterval);
                holdTimeout = null;
                holdInterval = null;
            };

            var startHolding = function (direction) {
                stopHolding();
                formatCounter(parseCounterValue() + direction * step);

                holdTimeout = setTimeout(function () {
                    holdInterval = setInterval(function () {
                        formatCounter(parseCounterValue() + direction * step);
                    }, 80);
                }, 400);
            };

            if (counterUp) {
                counterUp.addEventListener("mousedown", function () {
                    startHolding(1);
                });
            }

            if (counterDown) {
                counterDown.addEventListener("mousedown", function () {
                    startHolding(-1);
                });
            }

            document.addEventListener("mouseup", stopHolding);
            document.addEventListener("mouseleave", stopHolding);
        }
    };

    var onBerekenClick = function () {
        var m = parseInt(document.getElementById("afstand-m").value, 10) || 0;
        var cm = parseInt(document.getElementById("afstand-cm").value, 10) || 0;
        var afstand = parseFloat((m + cm / 100).toFixed(2));

        var promille = parseFloat(document.getElementById("percentage").value) || 0;

        // parse bob2 formatted value (e.g. "3.56 +" or "2.35 -")
        var bob2Raw = document.getElementById("bob2").value;
        var bob2Negative = bob2Raw.indexOf("-") !== -1;
        var bob2Numeric = parseFloat(bob2Raw.replace(/[^0-9.]/g, "")) || 0;
        var bob2 = bob2Negative ? -Math.abs(bob2Numeric) : bob2Numeric;

        var result = parseFloat((bob2 - afstand * promille * 0.001).toFixed(2));
        var bobberekendLabel = document.getElementById("bobberekend");
        if (result > 0) {
            bobberekendLabel.textContent = result.toFixed(2) + " +";
        } else if (result < 0) {
            bobberekendLabel.textContent = Math.abs(result).toFixed(2) + " -";
        } else {
            bobberekendLabel.textContent = "0.00";
        }

        var dalingCm = Math.round((bob2 - result) * 100);
        document.getElementById("cmdaling").textContent = "- " + dalingCm;
        clearBerekenStale();
    };

    setupBobStepper("bob", "bob-up", "bob-down");
    setupBobStepper("bob2", "bob2-up", "bob2-down");
    setupBobStepper("putdekselhoogte-put1", "putdekselhoogte-put1-up", "putdekselhoogte-put1-down");
    setupBobStepper("putdekselhoogte-put2", "putdekselhoogte-put2-up", "putdekselhoogte-put2-down");
    setupCounterStepper("afstand-m", "afstand-m-up", "afstand-m-down");
    setupCounterStepper("afstand-cm", "afstand-cm-up", "afstand-cm-down");

    var onResetClick = function () {
        var bewaar = document.getElementById("bewaar-putinfo").checked;
        document.getElementById("afstand-m").value = "00";
        document.getElementById("afstand-cm").value = "00";
        if (!bewaar) {
            document.getElementById("putnummer-put1").value = "";
            document.getElementById("putnummer-put2").value = "";
            document.getElementById("putdekselhoogte-put1").value = "0.00";
            document.getElementById("putdekselhoogte-put2").value = "0.00";
        }
        document.getElementById("bob2").value = "0.00";
        document.getElementById("percentage").selectedIndex = 0;
        document.getElementById("buizen").selectedIndex = 0;
        document.getElementById("bobberekend").textContent = "---";
        document.getElementById("cmdaling").textContent = "---";
        document.getElementById("put2dekking").textContent = "----";
        document.getElementById("put2bovenkant").textContent = "----";
        document.getElementById("put1dekking").textContent = "----";
        document.getElementById("put1bovenkant").textContent = "----";
        clearBerekenStale();
    };

    var markBerekenStale = function () {
        document.getElementById("bereken").classList.add("bereken-stale");
    };

    var clearBerekenStale = function () {
        document.getElementById("bereken").classList.remove("bereken-stale");
    };

    document.getElementById("bereken").addEventListener("click", onBerekenClick);
    document.getElementById("reset").addEventListener("click", onResetClick);

    ["afstand-m", "afstand-cm", "putdekselhoogte-put1", "putdekselhoogte-put2",
        "bob2", "putnummer-put1", "putnummer-put2", "percentage", "buizen"
    ].forEach(function (id) {
        var el = document.getElementById(id);
        if (el) { el.addEventListener("change", markBerekenStale); }
    });

    // stepper buttons don't fire 'change', so listen on mousedown directly
    ["afstand-m-up", "afstand-m-down", "afstand-cm-up", "afstand-cm-down",
        "putdekselhoogte-put1-up", "putdekselhoogte-put1-down",
        "putdekselhoogte-put2-up", "putdekselhoogte-put2-down",
        "bob2-up", "bob2-down"
    ].forEach(function (id) {
        var el = document.getElementById(id);
        if (el) { el.addEventListener("mousedown", markBerekenStale); }
    });
});
