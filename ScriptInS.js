// Buizen data (same as Script3.js)
var buizenData = [
  { materiaal: "PVC", diameter: 110, wanddikte: 3.4 },
  { materiaal: "PVC", diameter: 160, wanddikte: 4.7 },
  { materiaal: "PVC", diameter: 200, wanddikte: 5.9 },
  { materiaal: "PVC", diameter: 250, wanddikte: 7.3 },
  { materiaal: "PVC", diameter: 315, wanddikte: 9.2 },
  { materiaal: "PVC", diameter: 400, wanddikte: 11.7 },
  { materiaal: "PVC", diameter: 500, wanddikte: 14.6 },
  { materiaal: "PVC", diameter: 630, wanddikte: 18.3 },
  { materiaal: "Gres", diameter: 150, wanddikte: 25.0 },
  { materiaal: "Gres", diameter: 200, wanddikte: 30.0 },
  { materiaal: "Gres", diameter: 250, wanddikte: 35.0 },
  { materiaal: "Gres", diameter: 300, wanddikte: 40.0 },
  { materiaal: "Gres", diameter: 400, wanddikte: 40.0 },
  { materiaal: "Beton", diameter: 300, wanddikte: 50.0 },
  { materiaal: "Beton", diameter: 400, wanddikte: 60.0 },
  { materiaal: "Beton", diameter: 500, wanddikte: 70.0 },
  { materiaal: "Beton", diameter: 600, wanddikte: 80.0 },
  { materiaal: "Beton", diameter: 800, wanddikte: 100.0 },
  { materiaal: "Beton", diameter: 1000, wanddikte: 120.0 },
  { materiaal: "Beton", diameter: 1200, wanddikte: 120.0 },
  { materiaal: "HDPE", diameter: 63, wanddikte: 5.8 },
  { materiaal: "HDPE", diameter: 90, wanddikte: 8.2 },
  { materiaal: "HDPE", diameter: 110, wanddikte: 10.0 },
  { materiaal: "HDPE", diameter: 160, wanddikte: 14.6 },
  { materiaal: "HDPE", diameter: 200, wanddikte: 18.2 },
  { materiaal: "PP", diameter: 63, wanddikte: 4.8 },
  { materiaal: "PP", diameter: 90, wanddikte: 8.2 },
  { materiaal: "PP", diameter: 110, wanddikte: 10.0 },
  { materiaal: "PP", diameter: 160, wanddikte: 14.6 },
];

document.addEventListener("DOMContentLoaded", function () {
  // Populate all buizen selects
  var buizenSelects = document.querySelectorAll(".streng-select[id$='-buis']");
  buizenSelects.forEach(function (select) {
    buizenData.forEach(function (b, i) {
      var opt = document.createElement("option");
      opt.value = i;
      opt.text =
        b.materiaal +
        " " +
        b.diameter +
        " " +
        b.wanddikte.toFixed(1).replace(".", ",");
      select.appendChild(opt);
    });
  });

  // Tab panel switching
  var select = document.getElementById("put-select");
  var panels = document.querySelectorAll("#tab-panel-area .tab-panel");

  select.addEventListener("change", function () {
    panels.forEach(function (p) {
      p.style.display = "none";
    });
    var active = document.getElementById("panel-" + select.value);
    if (active) active.style.display = "block";
  });

  // Setup input steppers for bob/mv inputs
  var setupBobStepper = function (inputId) {
    var input = document.getElementById(inputId);
    if (!input) return;

    var min = parseFloat(input.dataset.min);
    var max = parseFloat(input.dataset.max);
    var step = parseFloat(input.dataset.step);

    var parseBobValue = function () {
      var raw = input.value.replace(",", ".");
      var isNegative = raw.indexOf("-") !== -1;
      var numeric = parseFloat(raw.replace(/[^0-9.]/g, "")) || 0;
      return isNegative ? -Math.abs(numeric) : numeric;
    };

    var formatBob = function (value) {
      var clamped = Math.min(max, Math.max(min, value));
      var rounded = parseFloat(clamped.toFixed(2));

      if (rounded > 0) {
        input.value = rounded.toFixed(2) + " +";
      } else if (rounded < 0) {
        input.value = Math.abs(rounded).toFixed(2) + " -";
      } else {
        input.value = "0.00";
      }
      return rounded;
    };

    // Initialize format
    if (input.value === "0.00") {
      input.value = "0.00";
    } else {
      formatBob(parseBobValue());
    }

    input.addEventListener("change", function () {
      formatBob(parseBobValue());
    });

    input.addEventListener("keydown", function (event) {
      if (event.key === "ArrowUp" || event.key === "ArrowDown") {
        event.preventDefault();
        var current = parseBobValue();
        var next = event.key === "ArrowUp" ? current + step : current - step;
        formatBob(next);
      }
    });
  };

  // Setup counter stepper for distance inputs
  var setupCounterStepper = function (inputId) {
    var input = document.getElementById(inputId);
    if (!input) return;

    var min = parseInt(input.dataset.min, 10);
    var max = parseInt(input.dataset.max, 10);
    var step = parseInt(input.dataset.step, 10);

    var parseCounterValue = function () {
      var numeric = input.value.replace(/[^0-9]/g, "");
      var value = parseInt(numeric, 10);
      return isNaN(value) ? 0 : value;
    };

    var formatCounter = function (value) {
      var clamped = Math.min(max, Math.max(min, value));
      input.value = clamped.toString().padStart(2, "0");
      return clamped;
    };

    formatCounter(parseCounterValue());

    input.addEventListener("change", function () {
      formatCounter(parseCounterValue());
    });

    input.addEventListener("keydown", function (event) {
      if (event.key === "ArrowUp" || event.key === "ArrowDown") {
        event.preventDefault();
        var current = parseCounterValue();
        var next = event.key === "ArrowUp" ? current + step : current - step;
        formatCounter(next);
      }
    });
  };

  // Setup all bob steppers (put mv inputs)
  for (var i = 1; i <= 11; i++) {
    setupBobStepper("put" + i + "-mv");
  }

  // Setup all counter steppers (distance inputs)
  for (var i = 1; i <= 10; i++) {
    setupCounterStepper("streng" + i + "-" + (i + 1) + "-m");
    setupCounterStepper("streng" + i + "-" + (i + 1) + "-cm");
  }

  // Add event listeners to update display when well data is entered
  for (var i = 1; i <= 11; i++) {
    var nrInput = document.getElementById("put" + i + "-nr");
    var mvInput = document.getElementById("put" + i + "-mv");

    if (nrInput) {
      nrInput.addEventListener("change", (function (putNum) {
        return function () {
          var el = document.getElementById("putnr" + putNum);
          if (el) el.textContent = this.value || "------";
        };
      })(i));
    }

    if (mvInput) {
      mvInput.addEventListener("change", (function (putNum) {
        return function () {
          var el = document.getElementById("mvput" + putNum);
          var val = this.value;
          if (el) el.textContent = val || "------";
        };
      })(i));
    }
  }

  // Parse bob formatted value
  var parseBobFormatted = function (raw) {
    var isNegative = raw.indexOf("-") !== -1;
    var numeric = parseFloat(raw.replace(/[^0-9.]/g, "")) || 0;
    return isNegative ? -Math.abs(numeric) : numeric;
  };

  // Format bob value for display
  var formatBobDisplay = function (value) {
    if (value > 0) {
      return value.toFixed(2) + " +";
    } else if (value < 0) {
      return Math.abs(value).toFixed(2) + " -";
    } else {
      return "0.00";
    }
  };

  // Main calculation function
  var onBerekenClick = function () {
    // Calculate all pipes sequentially
    for (var i = 1; i <= 10; i++) {
      calculatePipe(i);
    }
  };

  var calculatePipe = function (pipeNum) {
    var put1Num = pipeNum;
    var put2Num = pipeNum + 1;
    var strengNum = put1Num + "-" + put2Num;

    // Get input well data
    var put1MvEl = document.getElementById("put" + put1Num + "-mv");
    var put2MvEl = document.getElementById("put" + put2Num + "-mv");

    var put1Mv = put1MvEl ? parseBobFormatted(put1MvEl.value) : 0;
    var put2Mv = put2MvEl ? parseBobFormatted(put2MvEl.value) : 0;

    // Get pipe parameters
    var mEl = document.getElementById("streng" + strengNum + "-m");
    var cmEl = document.getElementById("streng" + strengNum + "-cm");
    var hellingEl = document.getElementById("streng" + strengNum + "-helling");
    var buisEl = document.getElementById("streng" + strengNum + "-buis");

    var m = mEl ? parseInt(mEl.value, 10) || 0 : 0;
    var cm = cmEl ? parseInt(cmEl.value, 10) || 0 : 0;
    var afstand = parseFloat((m + cm / 100).toFixed(2));
    var helling = parseFloat(hellingEl ? hellingEl.value : 0);
    var buisIndex = buisEl ? parseInt(buisEl.value, 10) : 0;

    // Get pipe diameter and wall thickness
    var buis = buizenData[buisIndex];
    var diameterMm = buis.diameter;
    var wallMm = buis.wanddikte;
    var pipeOuterM = Math.round(diameterMm + wallMm) / 1000;

    // Calculate bob1 (output of put1, input to pipe)
    var bob1 = put1Mv;

    // Calculate bob2L (output of pipe / bob of left side / output bob)
    // bob2L = bob1 - (afstand * helling * 0.001)
    var bob2L = parseFloat((bob1 - afstand * helling * 0.001).toFixed(2));

    // Calculate bob2 (input to put2)
    // The bottom of pipe is bob2L, so the bob of put2 must be bob2L
    var bob2 = bob2L;

    // Calculate dekking (cover) for put1: dekking = put1Mv - (bob1 + pipeOuterM)
    var bovenkant1 = parseFloat((bob1 + pipeOuterM).toFixed(2));
    var dekking1 = parseFloat((put1Mv - bovenkant1).toFixed(2));

    // Calculate dekking for put2
    var bovenkant2 = parseFloat((bob2 + pipeOuterM).toFixed(2));
    var dekking2 = parseFloat((put2Mv - bovenkant2).toFixed(2));

    // Update SVG display
    updateDisplay(put1Num, put2Num, pipeNum, bob1, bob2L, dekking1, dekking2, afstand);
  };

  var updateDisplay = function (put1Num, put2Num, pipeNum, bob1, bob2L, dekking1, dekking2, afstand) {
    // Update put1 bob and dekking (right side of pipe)
    var bob1El = document.getElementById("bob" + put1Num);
    if (bob1El) bob1El.textContent = formatBobDisplay(bob1);

    var dek1El = document.getElementById("dek" + put1Num);
    if (dek1El) dek1El.textContent = dekking1.toFixed(2);

    // Update put2 bob (right side) - this is bob2L from previous pipe
    var bob2El = document.getElementById("bob" + put2Num);
    if (bob2El) bob2El.textContent = formatBobDisplay(bob2L);

    var dek2El = document.getElementById("dek" + put2Num);
    if (dek2El) dek2El.textContent = dekking2.toFixed(2);

    // Update pipe output values (left side of pipe - bob2L and dekking2L)
    var bob2LEl = document.getElementById("bob" + (pipeNum) + "L");
    if (bob2LEl) bob2LEl.textContent = formatBobDisplay(bob2L);

    var dek2LEl = document.getElementById("dek" + (pipeNum) + "L");
    if (dek2LEl) dek2LEl.textContent = dekking2.toFixed(2);

    // Update pipe length
    var langEl = document.getElementById("lang" + pipeNum);
    if (langEl) langEl.textContent = afstand.toFixed(2) + " m";
  };

  // Reset function
  var onResetClick = function () {
    // Reset all input fields
    var inputsToReset = document.querySelectorAll(".put-input, .streng-input, .streng-select");
    inputsToReset.forEach(function (input) {
      if (input.type === "select-one") {
        input.selectedIndex = 0;
      } else if (input.classList.contains("put-input")) {
        input.value = "";
      } else {
        input.value = input.dataset.step ? "0.00" : "00";
      }
    });

    // Reset all display fields
    for (var i = 1; i <= 11; i++) {
      var bob = document.getElementById("bob" + i);
      var dek = document.getElementById("dek" + i);
      if (bob) bob.textContent = "------";
      if (dek) dek.textContent = "----";
    }
    for (var i = 2; i <= 11; i++) {
      var bobL = document.getElementById("bob" + i + "L");
      var dekL = document.getElementById("dek" + i + "L");
      if (bobL) bobL.textContent = "------";
      if (dekL) dekL.textContent = "----";
    }
    for (var i = 1; i <= 10; i++) {
      var lang = document.getElementById("lang" + i);
      if (lang) lang.textContent = "------";
    }
  };

  // Collect all data
  var collectData = function () {
    var data = {};

    // Collect well data
    for (var i = 1; i <= 11; i++) {
      var nr = document.getElementById("put" + i + "-nr");
      var mv = document.getElementById("put" + i + "-mv");
      data["put" + i + "_nr"] = nr ? nr.value : "";
      data["put" + i + "_mv"] = mv ? mv.value : "0.00";
    }

    // Collect pipe data
    for (var i = 1; i <= 10; i++) {
      var strengNum = i + "-" + (i + 1);
      var m = document.getElementById("streng" + strengNum + "-m");
      var cm = document.getElementById("streng" + strengNum + "-cm");
      var helling = document.getElementById("streng" + strengNum + "-helling");
      var buis = document.getElementById("streng" + strengNum + "-buis");

      data["streng" + strengNum + "_m"] = m ? m.value : "00";
      data["streng" + strengNum + "_cm"] = cm ? cm.value : "00";
      data["streng" + strengNum + "_helling"] = helling ? helling.value : "0.0";
      data["streng" + strengNum + "_buis"] = buis ? buis.value : "0";
    }

    return data;
  };

  // Restore all data
  var restoreData = function (data) {
    // Restore well data
    for (var i = 1; i <= 11; i++) {
      var nr = document.getElementById("put" + i + "-nr");
      var mv = document.getElementById("put" + i + "-mv");
      if (nr) {
        nr.value = data["put" + i + "_nr"] || "";
        var nrDisplay = document.getElementById("putnr" + i);
        if (nrDisplay) nrDisplay.textContent = nr.value || "------";
      }
      if (mv) {
        mv.value = data["put" + i + "_mv"] || "0.00";
        var mvDisplay = document.getElementById("mvput" + i);
        if (mvDisplay) mvDisplay.textContent = mv.value || "------";
      }
    }

    // Restore pipe data
    for (var i = 1; i <= 10; i++) {
      var strengNum = i + "-" + (i + 1);
      var m = document.getElementById("streng" + strengNum + "-m");
      var cm = document.getElementById("streng" + strengNum + "-cm");
      var helling = document.getElementById("streng" + strengNum + "-helling");
      var buis = document.getElementById("streng" + strengNum + "-buis");

      if (m) m.value = data["streng" + strengNum + "_m"] || "00";
      if (cm) cm.value = data["streng" + strengNum + "_cm"] || "00";
      if (helling) helling.value = data["streng" + strengNum + "_helling"] || "0.0";
      if (buis) buis.value = data["streng" + strengNum + "_buis"] || "0";
    }
  };

  // Save function
  var onOpslaanClick = function () {
    var data = collectData();
    var json = JSON.stringify(data, null, 2);
    var filename = "inserie.2ps";

    var blob = new Blob([json], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Load function
  var onLadenClick = function () {
    document.getElementById("laad-bestand-inserie").click();
  };

  var laadBestand = document.getElementById("laad-bestand-inserie");
  if (laadBestand) {
    laadBestand.addEventListener("change", function () {
      var file = laadBestand.files[0];
      if (!file) return;

      var reader = new FileReader();
      reader.onload = function (e) {
        try {
          restoreData(JSON.parse(e.target.result));
        } catch (err) {
          alert("Ongeldig bestand: " + err.message);
        }
      };
      reader.readAsText(file);
      laadBestand.value = "";
    });
  }

  // Print function
  var onAfdrukkenClick = function () {
    var printArea = document.getElementById("print-area");
    printArea.innerHTML = "";

    // Clone the SVG wrapper
    var svgWrapper = document.querySelector("div[style*='position: relative']");
    if (svgWrapper) {
      var clone = svgWrapper.cloneNode(true);

      // Remove buttons and other interactive elements from clone
      clone.querySelectorAll("button, select, input[type='file']").forEach(function (el) {
        el.remove();
      });

      printArea.appendChild(clone);
    }

    // Print
    window.print();
  };

  // Button event listeners
  document.getElementById("bereken-inserie").addEventListener("click", onBerekenClick);
  document.getElementById("reset-inserie").addEventListener("click", onResetClick);
  document.getElementById("opslaan-inserie").addEventListener("click", onOpslaanClick);
  document.getElementById("laden-inserie").addEventListener("click", onLadenClick);
  document.getElementById("afdrukken-inserie").addEventListener("click", onAfdrukkenClick);
});
