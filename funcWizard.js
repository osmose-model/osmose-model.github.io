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


/*function save(){
	var groupctr = 1;
	var grp = document.getElementsByName("selectedgroup");

	var json;
	var cat;
	var order;
	
	var savectr = 1;
	var fgroup = 0;
	var bgroup = 0;
	
	
	for(var i=0; i<grp.length; i++){
		if(grp[i].checked == true){
			
			var grpctr = $(grp[i]).attr('id');
			var groupNum = grpctr.slice(-1);
			
			var grpchoice = $("input[name=sample"+groupNum+"]:checked").val();
			
			if(grpchoice == "fgroup"){
				cat = "Focal";
				order = ++fgroup;
			}else{
				cat = "Background";
				order = ++bgroup;
			}
			
			var checkedSpecies = $('input[name='+groupNum+'species]:checked').map(function(){
				return this.value;
			}).get().join(',');
			
			json = '{"Functional_Group":"'+ $(grp[i]).val() +'","Category":"'+cat+'","Species":"' + checkedSpecies + '","Order":"'+order+'"}';
			
			sessionStorage.setItem('group'+savectr, json);
			savectr++;
		}
	}
	return true;
}*/

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

function populateProp(ctr, gen, sp, a){
	var species = "https://fishbase.ropensci.org/species?fields=Length,DemersPelag,DepthRangeShallow,DepthRangeDeep";
	
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
			output = true;
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			alert("Can't find the species!"+"\n"+"Please go to fishbase.org to find alternative matches.");
			output = false;
		}
	});
	return output;
}

function findFamOrOrder(ctr, gen, sp, a){
	

}

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
		
			if(result){
				$('#td'+snum+'species div:first-child').append($('<input>', {
					type: "checkbox",
					name: snum+"species",
					id: nextSp+"td"+snum+"species",
					value: genspec,
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