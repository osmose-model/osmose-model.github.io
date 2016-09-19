function listSubCountry(){
	var c_code = document.getElementById("country").value;

	$('#subcountry').empty();
	$('#subcountry').append($('<option>', {
		text: "Select",
		value: ""
	}));
	
	$('#faoarea').empty();
	$('#faoarea').append($('<option>', {
		text: "Select",
		value: ""
	}));
	
	if(c_code!= ""){
		$.ajax({
		type: 'GET',
		url: "subcountry.json",
		async:false,
		success: function (result) {
			
			var filter = $.grep(result, function(element,index){
				return element.C_Code == c_code;
			});
			
			$.each(filter, function(index, element){
				$('#subcountry').append($('<option>', {
					text: element.CountrySub,
					value: element.CSub_Code
				}));
			});
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			alert(textStatus);
		}
		});
		
		$.ajax({
		type: 'GET',
		url: "faoarea.json",
		async:false,
		success: function (result) {

			var filter = $.grep(result, function(element,index){
				return element.C_Code == c_code;
			});
			
			$.each(filter, function(index, element){
				$('#faoarea').append($('<option>', {
					text: element.FAO,
					value: element.AreaCode
				}));
			});
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			alert(textStatus);
		}
		});
	}
}

function selectFunctionalGroup(cb){
	var whatgroup = $(cb).attr('id');
	var groupNum = whatgroup.slice(-1);
	
	if(cb.checked){
		document.getElementById("group"+groupNum).style.backgroundColor = "White";
		document.getElementsByName("sample"+groupNum)[0].disabled = false;
		document.getElementsByName("sample"+groupNum)[1].disabled = false;
		var spcount = document.getElementsByName(groupNum+"species").length;
		for(var a=0; a<spcount; a++){
			document.getElementsByName(groupNum+"species")[a].disabled = false;
		}
		
		var arrayOfEdit = $('#group'+groupNum+' img').map(function(){
			return this;
		}).get();
		
		$(arrayOfEdit[0]).attr('onclick', 'changeFname("'+groupNum+'fgroupname")');
		$(arrayOfEdit[1]).attr('onclick', 'changeSpecies("'+groupNum+'")');
		
	}else{
		document.getElementById("group"+groupNum).style.backgroundColor = "LightGrey";
		document.getElementsByName("sample"+groupNum)[0].disabled = true;
		document.getElementsByName("sample"+groupNum)[1].disabled = true;
	
		var spcount = document.getElementsByName(groupNum+"species").length;
		for(var a=0; a<spcount; a++){
			document.getElementsByName(groupNum+"species")[a].disabled = true;
			document.getElementsByName(groupNum+"species")[a].checked = false;
		}
		
		$('#group'+groupNum+' img').each(function(index){
			$(this).prop('onclick',null).off('click');
		
		});
		
		$('#group'+groupNum+' input[type=text]').each(function(index){
			$(this).remove();
		});
		
		$('#group'+groupNum+' input[type=button]').each(function(index){
			$(this).remove();
		});
	}

}

function changeEcoOrCountry(){
	var selected = $("input[name=choose]:checked").val();
	
	if(selected == "eco"){
		document.getElementById("ecoDiv").style.backgroundColor = "White";
		document.getElementById("ecosystem").disabled = false;
		
		document.getElementById("country").disabled = true;
		document.getElementById("subcountry").disabled = true;
		document.getElementById("faoarea").disabled = true;
		
		$("#country").val("none");
		
		$('#subcountry').empty();
		$('#subcountry').append($('<option>', {
			text: "Select",
			value: "none"
		}));
			
		$('#faoarea').empty();
		$('#faoarea').append($('<option>', {
			text: "Select",
			value: "none"
		}));
		
		
	}else{
		document.getElementById("countryDiv").style.backgroundColor = "White";
		document.getElementById("country").disabled = false;
		document.getElementById("subcountry").disabled = false;
		document.getElementById("faoarea").disabled = false;
		
		document.getElementById("ecosystem").disabled = true;
		
		$("#ecosystem").val("none");
	}

}

function validateform1(){
	if(document.stepForm.choose.value == "eco"){
		if(document.stepForm.ecosystem.value == ""){
			alert("Please select an ecosystem!");
			document.stepForm.ecosystem.focus();
			return false;
		}
		return true;
	}
	if(document.stepForm.choose.value == "cntry"){
		if(document.stepForm.country.value == ""){
			alert("Please select a country!");
			document.stepForm.country.focus();
			return false;
		}
		if(document.stepForm.country.value == "840"){
			if(document.stepForm.subcountry.value == ""){
				alert("Please select a subcountry!");
				document.stepForm.subcountry.focus();
				return false;
			}
		}
		if(document.stepForm.faoarea.value == ""){
			alert("Please select a faoarea!");
			document.stepForm.faoarea.focus();
			return false;
		}
		return true;
	}
}

function changeNext(current, targetNext){
	var steps = $(document.body).find("fieldset");
    var count = steps.size();

	var stepName = "step" + current;
	$("#" + stepName + "Next").unbind("click");
	
	$("#" + stepName + "Next").bind("click", function(e) {
		$("#" + stepName).hide();
		$("#step" + targetNext).show();
	});
}

function changePrev(current, targetPrev){

	var stepName = "step" + current;
	$("#" + stepName + "Prev").unbind("click");
	
	$("#" + stepName + "Prev").bind("click", function(e) {
		$("#" + stepName).hide();
		$("#step" + targetPrev).show();
	});
}

function populateProp(ctr, gen, sp, a){
	var species = "https://fishbase.ropensci.org/species?fields=Length,DemersPelag,DepthRangeShallow,DepthRangeDeep,SpecCode";
	
	var out;
	var sizeid;
	var habitatid;
	var depthid;
	
	urlsp = species + "&genus=" + gen + "&species=" + sp;
			
	$.ajax({
		type: 'GET',
		url: urlsp,
		async:false,
		success: function (result){
			out = result.data[0];
			sizeid= 'td'+ctr+'size';
			habitatid = 'td'+ctr+'habitat';
			depthid = 'td'+ctr+'depth';
			
			$('#'+sizeid).append('<span id="'+a+sizeid+'">'+out['Length']+'</span><br>');
			$('#'+habitatid).append('<span id="'+a+habitatid+'">'+out['DemersPelag']+'</span><br>');
			
			if(out['DepthRangeShallow'] == null || out['DepthRangeShallow'] == 0){
				if(out['DepthRangeDeep'] == null || out['DepthRangeDeep'] == 0){
					$('#'+depthid).append('<br>');
				}else{
					$('#'+depthid).append('<span id="'+a+depthid+'">'+out['DepthRangeDeep'] +'</span><br>');
				}
			}else{
				if(out['DepthRangeDeep'] == null || out['DepthRangeDeep'] == 0){
					$('#'+depthid).append('<span id="'+a+depthid+'">'+out['DepthRangeShallow'] + '</span><br>');
				}else{
					$('#'+depthid).append('<span id="'+a+depthid+'">'+out['DepthRangeShallow']+"-" + out['DepthRangeDeep'] +'</span><br>');
				}
			}
			output = out['SpecCode'];		//return speccode
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			alert("Can't find the species!"+"\n"+"Please go to fishbase.org or sealifebase.org to find alternative matches.");
			output = false;
		}
	});
	return output;
}

function deselect(ctr) {
  $('#message'+ctr).slideFadeToggle(function() {
	var msgicon = $('#info'+ctr);
    msgicon.removeClass('selected');
  });    
}

function closeSelected(){
	$('.selected').each(function(index){
		var ctrpopup = $(this).attr('id').slice(-1);
		
		deselect(ctrpopup);
	});
}

function msgpop(ctr){
	
	var msgicon = $('#info'+ctr);
	var msg = $('#message'+ctr);
	
	if(msgicon.hasClass('selected')){
		deselect(ctr);
	}else{
		closeSelected();
		msgicon.addClass('selected');
		msg.slideFadeToggle();
	}
	return false;
}

$.fn.slideFadeToggle = function(easing, callback) {
  return this.animate({ opacity: 'toggle', height: 'toggle' }, 'fast', easing, callback);
};
/*
$(document).mouseup(function (e)
{
	if($('.selected')[0]){
		var ctrpopup = $('.selected').attr('id').slice(-1);
		var container = $('#message'+ctrpopup);
		
		if (!container.is(e.target) // if the target of the click isn't the container...
			&& container.has(e.target).length === 0) // ... nor a descendant of the container
		{
			closeSelected();
		}
	}
});
*/
function changeFname(fname){
	$('input[name=new]').remove();
	$('input[name=OKbtn]').remove();
	var prev = $('#'+fname).text();
	
	$('#'+fname).empty();
	$('#'+fname).append($('<input>', {
		type: "text",
		name: "new",
		value: prev,
		size: "8px",
		onkeypress: "return saveFname('"+fname+"',event.keyCode)"
	}));
	
	$('#'+fname).append($('<input>', {
		type: "button",
		value: "OK",
		size: "5px",
		name: "OKbtn",
		onClick: "saveFname('"+fname+"',13);"
	}));
}

function saveFname(fn,e){
	if(e== 13){
		var newFname = $('input[name=new]').val();
		
		$('#'+fn).empty();
		$('#'+fn).append($('<span>', {
			text: newFname
		}));
		
		var div = $('<div>', {
			class: "floatRight"
		});
		
		$('#'+fn).append(div);
		div.prepend($('<img>', {
			class: "imgSize25",
			src: "edit.png",
			onClick: "changeFname('"+fn+"');"
		}))
		return false;
	}
}

function changeSpecies(spnum){
	$('input[name=new]').remove();
	$('input[name=OKbtn]').remove();
	$('#td'+spnum+'species div:nth-child(2)').remove();
	
	$('#td'+spnum+'species div:first-child').append("<br>");
	
	$('#td'+spnum+'species div:first-child').append($('<input>', {
		type: "text",
		name: "new",
		size: "8px",
		onkeypress: "return saveSname('"+spnum+"',event.keyCode)"
	}));
	
	$('#td'+spnum+'species div:first-child').append($('<input>', {
		type: "button",
		value: "OK",
		name: "OKbtn",
		onClick: "saveSname('"+spnum+"',13);"
	}));

}

function saveSname(snum,e){
	if(e== 13){
		var newSname = $('input[name=new]').val();
		var nextSp = document.getElementsByName(snum+"species").length;
		
		newSname = newSname.slice(0,1).toUpperCase() + newSname.slice(1);
		
		var genspecA = newSname.split(" ");
		
		if(genspecA.length < 2){
			alert("Invalid species name!");
			return false;
		}else{
			var gen = genspecA[0];
			var sp = genspecA[1];
			
			var genspec = gen + sp.slice(0,1).toUpperCase() + sp.slice(1);
			
			$('input[name=new]').remove();
			$('input[name=OKbtn]').remove();
			
			var result = populateProp(snum, gen, sp, nextSp);
		
			if(result != false){
				$('#td'+snum+'species div:first-child').append($('<input>', {
					type: "checkbox",
					name: snum+"species",
					id: nextSp+"td"+snum+"species",
					value: genspec+result,
					checked: "checked"
				}));
				
				$('#td'+snum+'species div:first-child').append($('<label>', {
					'for': nextSp+"td"+snum+"species",
					text: newSname
				}));
			}
		}
		var div = $('<div>', {
			class: "overflow-hidden"
		});
			
		$('#td'+snum+'species').append(div);
		div.prepend($('<img>', {
			class: "imgSize25",
			src: "edit.png",
			onClick: "changeSpecies('"+snum+"');"
		}));
		
		return false;
	}		
}
/*
function addFGroup(){
	var nextgrp = document.getElementsByName("selectedgroup").length;
	
	$('table').append($('<tr>', {
		id: "group"+nextgrp	
	}));
	
	var nextTr = $('#group'+nextgrp);
	
	$(nextTr).append($('<td>'));
	
	var divFname = $('<div>', {
		class: "center"
	});
	
	$(nextTr+' td:last').append(divFname);
	divFname.prepend($('<input>', {
		type: "checkbox",
		name: "selectedgroup",
		id: "selected"+nextgrp,
		checked: "checked"
	}));
	
	$(nextTr).append($('<td>', {
		id: nextgrp+"fgroupname"
	}));

}*/

function validateformGroup(){
	var ctr = 1;
	var bgroup = false;
	var fgroup = false;
	
	while(document.getElementsByName("sample"+ctr).length > 0){
		if(fgroup == false && $("input[name='sample"+ctr+"']:checked").val() == "fgroup"){
			fgroup = true;
		}
		if(bgroup == false && $("input[name='sample"+ctr+"']:checked").val() == "bgroup"){
			bgroup = true;
		}
		ctr++;
	}
	
	if(fgroup == true && bgroup == true){
		return true;
	}else if(fgroup == false){
		alert("Please select at least one focal functional group.");
		return false;
	}else if(bgroup == false){
		alert("Please select at least one background functional group.");
		return false;
	}
}

function validateStep(){
	var steps = $('#stepsInput').val();

	if(steps == ""){
		alert("Please enter a valid number.");
		return false;
	}else return true;
}

function download(){
	/*change status label to process ongoing */
	var statusLabel = $('#status');
	statusLabel.empty();
	statusLabel.append("Preparing configuration...");
	
	var downloadEl = $('#downloadLink');
	downloadEl.text(" ");
	
	//time steps per year
	var steps = $('#stepsInput').val();
	
	//compile data
	var jsonArr = [];
	
	var groupctr = 1;
	var ctr;
	
	while(document.getElementsByName(groupctr+"species").length > 0){
		if($("#selected"+groupctr).is(':checked')){
			ctr = groupctr;
			var group1 = document.getElementsByName(ctr+"species");
			var len1 = group1.length;
			var gname = $('#'+ctr+'fgroupname span').text();
		
			var fgroup = ($("input[name='sample"+ctr+"']:checked").val() == "fgroup" ? "focal" : "background");
			var temp;
			
			var taxaArr = [];
			
			for(var a=0; a<len1; a++){
				if(group1[a].checked){
					var genspec = group1[a].value.match(/[A-Z]?[a-z]+|[0-9]+/g);
					var gen = genspec[0];	//genus
					var sp = genspec[1];	//species
					var id = genspec[2];	// speccode
					var link = (genspec[3] == "Fb" ? "http://fishbase.org/summary/"+id : "http://sealifebase.org/summary/"+id); 	//fb or slb
					var nameofspec = gen+' '+sp.slice(0,1).toLowerCase() + sp.slice(1);
					
					taxaArr.push({"name": nameofspec, "url": link});
				}
			}
			
			if(taxaArr.length > 0){
				jsonArr.push({
					"name": gname,
					"type": fgroup,
					"taxa": taxaArr
				});
			}
		}
		groupctr++;
	}
	
	var config = {
        "timeStepsPerYear" : steps,
        "groups" : jsonArr
    };

	var generateConfig = osmose.generateConfig(config, function(err, url) {
		downloadEl.text("Click here to download");
		downloadEl.attr("download", "osmose_config.zip");
		downloadEl.attr("href", url);
		
		statusLabel.empty();
		statusLabel.append("Done preparing configuration");
    });
	
	return false;
}