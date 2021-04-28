var X_RANGE = [0, 100];
var Y_RANGE = [0, 100];
var NODE_SIZE = 10;
var NODE_INIT_SIZE = 15;
var NODE_COLOR = "#0074D9";
var NODE_INIT_COLOR = "#3D9970";
var EDGE_SIZE = 2;
var EDGE_COLOR = "#343434";
var EDGE_TYPE = "curvedArrow";

var edgeIdx = 0;

var stateNames = [];

var clickedNode = "";
var clickedNodeColor = "";

$(document).ready(function() {

  // Initializing Checkbox and Dropdown Elements
  $('.ui.toggle').checkbox();
  $('.ui.dropdown').dropdown();

  // Disabling the Modify State Panel
  disableModifyStatePanel();

  // Resizing Textarea
  autoResizeTextarea();

  // Adding State On Button Click
  $("#btnAddState").on("click", function() {
    // Retrieving Input
    var stateName = $("input[name=inputNewStateName]").val();
    var initialState = $("input[name=toggleNewInitialState]").is(":checked");
    var connectedTo = $("input[name=dropdownNewStateConnectedTo]").val();
    var ap = $("input[name=inputNewStateAP]").val();
    if (ap == "") {
      ap = "Null";
    }
    
    // Validating Input
    if (stateName == "") {
      alert("ERROR: State name cannot be empty.");
      return;
    }
    else if (stateNames.includes(stateName)) {
      alert("ERROR: State name already exists.");
      return;
    }

    // Selecting Random Position
    var x = randInt(X_RANGE[0], X_RANGE[1]);
    var y = randInt(Y_RANGE[0], Y_RANGE[1]);

    // Creating Outgoing Edge Link
    var outgoingEdgeId = [];
    if (connectedTo != "") {
      connectedTo = connectedTo.split(",");
      for (var i = 0; i < connectedTo.length; i++) {
        outgoingEdgeId.push(stateName + "_" + connectedTo[i]);
      }
    }
    else {
      connectedTo = [];
    }
    
    // Adding Node
    var node = {'id': stateName, 'stateName': stateName, 'ap': ap, 'label': stateName + " | " + ap, 'connectedTo': connectedTo, 'outgoingEdgeId': outgoingEdgeId, 'x': x, 'y': y, 'size': NODE_SIZE, 'color': NODE_COLOR, 'isInitial': false, 'isClicked': false};
    if (initialState == true) {
      node.color = NODE_INIT_COLOR;
      node.size = NODE_INIT_SIZE;
      node.isInitial = true;
    }
    s.graph.addNode(node);

    outgoingEdgeId.forEach(e => {
      console.log(e);
      var edge = {'id': e, 'source': e.split("_")[0], 'target': e.split("_")[1], 'size': EDGE_SIZE, 'color': EDGE_COLOR, 'type': EDGE_TYPE};
      s.graph.addEdge(edge);
    });

    clearNewStatePanel();
    stateNames.push(stateName);
    updateConnectedToDropdown();
    clearNodeSelection();
    s.refresh();

    updateKripkeStructure();
  });

  // Modifying Selected State on Button Click
  $("#btnModifyState").on("click", function() {
    var initialState = $("input[name=toggleModifyInitialState]").is(":checked");
    var connectedTo = $("input[name=dropdownModifyStateConnectedTo]").val();
    var ap = $("input[name=inputModifyStateAP]").val();
    if (ap == "") {
      ap = "Null";
    }

    // Updating Node Properties
    clickedNode.isInitial = initialState;
    clickedNode.ap = ap;
    clickedNode.color = NODE_COLOR;
    clickedNode.label = clickedNode.stateName + " | " + ap;
    clickedNode.size = NODE_SIZE;
    if (initialState == true) {
      clickedNode.color = NODE_INIT_COLOR;
      clickedNode.size = NODE_INIT_SIZE;
    }
    clickedNodeColor = clickedNode.color;

    // Updating Edge Connections
    // Deleting Old Edge Connections
    clickedNode.outgoingEdgeId.forEach(id => {
      // console.log(s.graph.edges().indexOf(id));

      s.graph.edges().forEach(old_edge => {
        if (old_edge.id == id) {
          s.graph.dropEdge(id);
        }
      })

      // if (s.graph.edges().indexOf(id) > -1) {
      //   s.graph.dropEdge(id);
      //   console.log("Dropped");
      // }
    });

    var outgoingEdgeId = [];
    if (connectedTo != "") {
      connectedTo = connectedTo.split(",");
      for (var i = 0; i < connectedTo.length; i++) {
        outgoingEdgeId.push(clickedNode.stateName + "_" + connectedTo[i]);
      }
    }
    else {
      connectedTo = [];
    }

    clickedNode.outgoingEdgeId = outgoingEdgeId;
    clickedNode.connectedTo = connectedTo;

    outgoingEdgeId.forEach(e => {
      console.log(e);
      var edge = {'id': e, 'source': e.split("_")[0], 'target': e.split("_")[1], 'size': EDGE_SIZE, 'color': EDGE_COLOR, 'type': EDGE_TYPE};
      s.graph.addEdge(edge);
    });
    
    // if (clickedNode.connectedTo != connectedTo) {
    //   if (clickedNode.outgoingEdgeId != "") {
    //     var nodeExists = false
    //     for (var i = 0; i < s.graph.edges().length; i++) {
    //       if (clickedNode.outgoingEdgeId == s.graph.edges()[i].id) {
    //         nodeExists = true;
    //         break;
    //       }
    //     }
    //     if (nodeExists == true) {
    //       s.graph.dropEdge(clickedNode.outgoingEdgeId);
    //     }
    //     else {
    //       clickedNode.outgoingEdgeId = "";
    //     }
    //   }
    //   clickedNode.connectedTo = connectedTo;
    //   clickedNode.outgoingEdgeId = "";

    //   if (connectedTo != "None") {
    //     clickedNode.outgoingEdgeId = "e" + edgeIdx;
    //     var edge = {'id': clickedNode.outgoingEdgeId, 'source': clickedNode.stateName, 'target': clickedNode.connectedTo, 'size': EDGE_SIZE, 'color': EDGE_COLOR, 'type': EDGE_TYPE};
    //     s.graph.addEdge(edge);
    //     edgeIdx++;
    //   }
    // }

    clearNodeSelection();
    s.refresh();
    
    updateKripkeStructure();
  });

  // Deleting Selected State on Button Click
  $("#btnDeleteState").on("click", function() {
    var res = confirm("Are you sure you want to delete this state and all the edges associated with it?");
    if (res == true) {
      var stateName = clickedNode.stateName;
      deleteFromArray(stateNames, stateName);
      clearNodeSelection();
      s.graph.dropNode(stateName);
      updateConnectedToDropdown();
      s.refresh();

      updateKripkeStructure();
    }
  });

  // Clearing Model On Button Click
  $("#btnClearModel").on("click", function() {
    if (s.graph.nodes().length > 0) {
      var res = confirm("Are you sure you want to clear the model?");
      if (res == true) {
        s.graph.clear();

        stateNames.length = 0;
        updateConnectedToDropdown();
        s.refresh();

        updateKripkeStructure();
      }
    }
    else {
      alert("ERROR: Model is already cleared.");
    }
  });

  // Initializing Graph Component
  var s = new sigma(
    {
      renderer: {
        container: document.getElementById('sigma-container'),
        type: 'canvas'
      },
      settings: {
        minEdgeSize: 0.1,
        maxEdgeSize: 5,
        minNodeSize: 1,
        maxNodeSize: 20,
        borderSize: 2,
        singleHover: true,
        autoRescale: false
      }
    }
  );

  // Adding Node Click Event
  s.bind('clickNode', function(e) {
    var stateName = e.data.node.stateName;
    var connectedTo = e.data.node.connectedTo;
    var isInitial = e.data.node.isInitial;
    var ap = e.data.node.ap;

    clearNodeSelection();

    enableModifyStatePanel();

    $("input[name=inputModifyStateName]").val(stateName);
    if (isInitial) {
      $("#toggleDivModifyInitialState").checkbox("check");
    }
    else {
      $("#toggleDivModifyInitialState").checkbox("uncheck");
    }
    $("#dropdownDivModifyStateConnectedTo").dropdown('set selected', connectedTo);
    if (ap != "Null") {
      $("input[name=inputModifyStateAP]").val(ap);
    }
    else {
      $("input[name=inputModifyStateAP]").val("");
    }

    selectNode(e.data.node);
  });

  // Adding Background Click Event
  s.bind('clickStage',function(e) {
    clearNodeSelection();
  });

  // Enabling Node Drag
  var dragListener = sigma.plugins.dragNodes(s, s.renderers[0]);

  // Function for selecting node
  function selectNode(node) {
    clickedNode = node;
    clickedNodeColor = clickedNode.color;
    clickedNode.isClicked = true;
    clickedNode.color = "#FF0000";
    s.refresh();
  }

  //Function for clearing node selection
  function clearNodeSelection() {
    if (clickedNode != null) {
      clickedNode.color = clickedNodeColor
      clickedNode.isClicked = false;
  
      clickedNode = null;
      clickedNodeColor = "";

      clearModifyStatePanel();
      disableModifyStatePanel();
      s.refresh();
    }
  }

  // Generates Kripke Structure From Graph
  function generateKripkeStructure() {
    var str = "";
    var S = [];
    var S0 = [];
    var R = [];
    var L = [];

    var nodes = s.graph.nodes();
    var edges = s.graph.edges();

    s.graph.nodes().forEach(node => {
      S.push(node.stateName);
      if (node.isInitial == true) {
        S0.push(node.stateName);
      }
      L.push("(" + node.stateName + "|" + node.ap + ")");
    });

    s.graph.edges().forEach(edge => {
      R.push("(" + edge.source + "," + edge.target + ")");
    });

    str = "S=" + S.toString() + "\nS0=" + S0.toString() + "\nR=" + R.toString() + "\nL=" + L.toString();
    return str;
  }

  function updateKripkeStructure() {
    $("#textareaKripke").val(generateKripkeStructure());
    $("#textareaKripke").attr('disabled', true);
  }

  // Handling Textarea Height Dynamically On Resize Event
  $(window).resize(function() {
    autoResizeTextarea();
  })

});

function autoResizeTextarea() {
  if (document.body.clientHeight > 900) {
    var rowValKripke = 1;
    $("#textareaKripke").attr("rows", rowValKripke);
    while(isScrollbarVisible() == false) {
      $("#textareaKripke").attr("rows", rowValKripke);
      rowValKripke++;
    }
    rowValKripke -= 2;
    $("#textareaKripke").attr("rows", rowValKripke);

    var rowValAnalysis = 1;
    $("#textareaAnalysis").attr("rows", rowValAnalysis);
    while(isScrollbarVisible() == false) {
      $("#textareaAnalysis").attr("rows", rowValAnalysis);
      rowValAnalysis++;
    }
    rowValAnalysis -= 2;
    $("#textareaAnalysis").attr("rows", rowValAnalysis);
  }
}

function disableModifyStatePanel() {
  $('#modifyDiv').find('input, textarea, button, select').prop('disabled', true);
  $("#dropdownDivModifyStateConnectedTo").addClass("disabled");
  $("#btnClearModel").prop('disabled', false);
}

function enableModifyStatePanel() {
  $('#modifyDiv').find('input, textarea, button, select').prop('disabled', false);
  $("#dropdownDivModifyStateConnectedTo").removeClass("disabled");
  $("input[name=inputModifyStateName]").prop('disabled', true);
}

function clearModifyStatePanel() {
  $("input[name=inputModifyStateName]").val("");
  $("#toggleDivModifyInitialState").checkbox("uncheck");
  $("#dropdownDivModifyStateConnectedTo").dropdown('clear');
  $("input[name=inputModifyStateAP]").val("");
}

function clearNewStatePanel() {
  $("input[name=inputNewStateName]").val("");
  $("#toggleDivNewInitialState").checkbox("uncheck");
  $("#dropdownDivNewStateConnectedTo").dropdown('clear');
  $("input[name=inputNewStateAP]").val("");
}

function updateConnectedToDropdown() {
  $("#menuNewStateConnectedTo").empty();
  $("#menuModifyStateConnectedTo").empty();

  stateNames.forEach(function(item, index) {
    $("#menuNewStateConnectedTo").append("<div class='item' data-value='" + item + "'>" + item + "</div>");
    $("#menuModifyStateConnectedTo").append("<div class='item' data-value='" + item + "'>" + item + "</div>");
  });
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function isScrollbarVisible() {
  if ($(document).height() > $(window).height()) {
    return true;
  }
  else {
    return false;
  }
}

function deleteFromArray(array, item) {
  const index = array.indexOf(item);
  if (index > -1) {
    array.splice(index, 1);
  }
}



// var graph = {
//   nodes: [
//     { id: "n0", label: "A node", x: 0, y: 1, size: 3, color: '#008cc2' },
//     { id: "n1", label: "Another node", x: 3, y: 1, size: 2, color: '#008cc2' },
//     { id: "n2", label: "And a last one", x: 1, y: 3, size: 1, color: '#E57821' }
//   ],
//   edges: [
//     { id: "e0", source: "n0", target: "n1", color: '#282c34', type: 'line', size: 0.5 },
//     { id: "e1", source: "n1", target: "n2", color: '#282c34', type: 'curve', size: 1 },
//     { id: "e2", source: "n2", target: "n0", color: '#FF0000', type: 'line', size: 2 }
//   ]
// }


