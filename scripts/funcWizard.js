/****** Global variable ********/
var MAX_Sp_perFuncGroup = 30;
var NewFunctionalGroup = false;
var NewFuncGroupStep = 0;
var FuncGroupArr = [];
var FuncGroupArrlen = 0;
var defaultFuncGroup = [];
var classArr = [];
var classArrlen = 0;
var genSpecArr = [];
var genSpecArrlen = 0;
var genusArr = [];
var familyArr = [];
var orderArr = [];
var allFuncGroup = {};
var defaultFunchGroup = [
					{funcname:"zooplankton", funcgroup:"biotic_resource"},
					{funcname:"phytoplankton", funcgroup:"biotic_resource"}
					];

var urlForFunctionalGroupsByEcosystem = "data/ecosystem_funcgrp.json";
var urlForFunctionalGroupsByCountryFAO = "data/countryFAO_funcgrp.json";
var urlForFunctionalGroupsByCountrySubFAO = "data/countrySubFAO_funcgrp.json";

/****** End of Global variable ******/

/****** AJAX of JSON data ******/
$.ajax({
	type: 'GET',
	url: "data/ecosystem.json",
	success: function (result) {
		
		$.each(result, function(index, element){
			$('#ecosystem').append($('<option>', {
				text: element.EcosystemName,
				value: element.E_CODE + ""
			}));
		});
		
	},
	error: function(XMLHttpRequest, textStatus, errorThrown) {
		alert(textStatus);
	}
});

$.ajax({
	type: 'GET',
	url: "data/country.json",
	success: function (result) {
		
		$.each(result, function(index, element){
			$('#country').append($('<option>', {
				text: element.Country,
				value: "" + element.C_Code
			}));
		});
	},
	error: function(XMLHttpRequest, textStatus, errorThrown) {
		alert(textStatus);
	}
});

$.ajax({
	type: 'GET',
	url: "data/class.json",
	success: function (result) {
		
		$.each(result, function(index, element){
			classArr[classArrlen++] = element.Class;
		});
	}
});

$.ajax({
	type: 'GET',
	url: "data/genus_species.json",
	success: function (result) {
		
		$.each(result, function(index, element){
			var genSpec = element.Genus + " " + element.Species;
			genSpecArr[genSpecArrlen++] = genSpec;
		});
	}
});

/****** end of AJAX of JSON data ******/

function listSubCountry(){
	var c_code = document.getElementById("country").value;
	
	$("#funcGrptable").find("tr:gt(0)").remove();
	$('#subcountry').empty();
	$('#subcountry').append($('<option>', {
		text: "Select",
		value: ""
	}));
	$('#subcountry').prop( "disabled", false );
	
	if(c_code!= ""){
		var subArr = [];		//put the distinct subcountry in the array
		var subArrlen = 0;
		
		$.ajax({
		type: 'GET',
		url: "data/subcountryFao.json",
		success: function (result) {
			
			var filter = $.grep(result, function(element,index){
				return (element.C_Code == c_code && element.AreaCode > 10);
			});
			
			var len = Object.keys(filter).length;
			
			if(len > 0){
				$.each(filter, function(index, element){
					if ($.inArray(element.CSub_Code,subArr) === -1) {
						subArr[subArrlen++] = element.CSub_Code;
						$('#subcountry').append($('<option>', {
							text: element.CountrySub,
							value: element.CountrySub
						}));
					}
				});
			}else{
				$('#subcountry').prop( "disabled", true );
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			alert(textStatus);
		}
		});
		
		listFao();
	}
}

function listFao(hasSubCountry = false){
	var c_code = document.getElementById("country").value;
	var c_subcode = document.getElementById("subcountry").value;
	var file = "data/faoarea.json";
	var filter;
	
	$('#faoarea').empty();
	$('#faoarea').append($('<option>', {
		text: "Select",
		value: ""
	}));
	
	if(hasSubCountry && c_subcode != ""){
		file = "data/subcountryFao.json";
	}
	
	if(c_code != ""){	
		$.ajax({
		type: 'GET',
		url: file,
		success: function (result) {
			
			if(hasSubCountry && c_subcode != ""){
				filter = $.grep(result, function(element,index){
					return (element.CountrySub == c_subcode && element.AreaCode > 10);
				});
			}else{
				filter = $.grep(result, function(element,index){
					return (element.C_Code == c_code && element.AreaCode > 10);
				});
			}
			
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

function unSelectClass(cbClass){
	if(!cbClass.checked){
		var className = $(cbClass).attr('value');
		var cbName = $(cbClass).attr('name');
		var clnum = cbName.replace('class','');
		
		var speciescount = $('input[name="'+clnum+'class"]').length;
		
		for(var a=0; a<speciescount; a++)
		{
			var classId = a+"td"+clnum+"class";
			var classCurrent = $('#'+classId).val();
			
			if(className == classCurrent)
			{
				var speciesId = a+"td"+clnum+"species";
				
				$('#'+classId).prop('checked', false);
				$('#'+speciesId).prop('checked', false);
			}
		}
	}
}

function selectFunctionalGroup(cb){
	var whatgroup = $(cb).attr('id');
	var groupNum = whatgroup.replace('selected','');
	var spcount = 0;
	var a = 0;
	
	if(cb.checked){
		document.getElementById("group"+groupNum).style.backgroundColor = "White";
		document.getElementsByName("sample"+groupNum)[0].disabled = false;
		document.getElementsByName("sample"+groupNum)[1].disabled = false;
		spcount = document.getElementsByName(groupNum+"species").length;
		for(a=0; a<spcount; a++){
			document.getElementsByName(groupNum+"species")[a].disabled = false;
			document.getElementsByName(groupNum+"class")[a].disabled = false;
		}
		
		var arrayOfEdit = $('#group'+groupNum+' img').map(function(){
			return this;
		}).get();
		
		$(arrayOfEdit[0]).attr('onclick', 'changeFname("'+groupNum+'fgroupname")');
		$(arrayOfEdit[1]).attr('onclick', 'changeClass("'+groupNum+'")');
		$(arrayOfEdit[2]).attr('onclick', 'changeSpecies("'+groupNum+'")');
		
	}else{
		for(var b=0; b<defaultFunchGroup.length; b++){
			if(defaultFunchGroup[b].funcname == $(cb).attr('value')){
				alert("The "+defaultFunchGroup[b].funcname+" group cannot be deselected.");
				$(cb).prop('checked', true);
				return true;
			}
		}
		
		document.getElementById("group"+groupNum).style.backgroundColor = "LightGrey";
		document.getElementsByName("sample"+groupNum)[0].disabled = true;
		document.getElementsByName("sample"+groupNum)[1].disabled = true;
	
		spcount = document.getElementsByName(groupNum+"species").length;
		for(a=0; a<spcount; a++){
			document.getElementsByName(groupNum+"species")[a].disabled = true;
			document.getElementsByName(groupNum+"species")[a].checked = false;
			document.getElementsByName(groupNum+"class")[a].disabled = true;
			document.getElementsByName(groupNum+"class")[a].checked = false;
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

function alertCantChange(cbFuncGroup){
	var whatgroup = $(cbFuncGroup).attr('id');
	var groupNum = whatgroup.replace('fgroupradio','');
	var funcName = $("#selected"+groupNum).attr('value');
	funcName = funcName.slice(0,1).toUpperCase() + funcName.slice(1);
	
	alert("The "+funcName+ " group can only be defined as a background functional group.");
	$("#bgroupradio"+groupNum).prop('checked', true);
}

function populateFuncTable(){
	var selected = $("input[name=choose]:checked").val();
	var urldata = '';
	
	if(selected == "eco"){
		var e_code = document.getElementById("ecosystem").value;
		if(e_code == ''){
			$("#funcGrptable").find("tr:gt(0)").remove();
		}else{
			urldata = urlForFunctionalGroupsByEcosystem;
		}
	}else if(selected == "cntry")
	{
		var c_code = document.getElementById("country").value;
		var area_code = document.getElementById("faoarea").value;
		var c_subcode = document.getElementById("subcountry").value;
		
		if(c_code == '' || area_code == ''){
			$("#funcGrptable").find("tr:gt(0)").remove();
		
		}else if (c_subcode == ''){
			urldata = urlForFunctionalGroupsByCountryFAO;
		}else{
			urldata = urlForFunctionalGroupsByCountrySubFAO;
		}
	}
		
	if(urldata != ''){
		$("#funcGrptable").find("tr:gt(0)").remove();
		
		var resultData;
		$.when(
			$.ajax({
				type: 'GET',
				url: urldata,
				success: function (result) {
					resultData = result;
				}
			})
		).then(function() {
			if(resultData){
				var filter = $.grep(resultData, function(element,index){
					if(selected == "eco"){	return (element.E_CODE == e_code);	}
					else if(c_subcode == ''){		return (element.C_Code == c_code && element.AreaCode == area_code);}
					else{	return (element.C_Code == c_code && element.CountrySub == c_subcode && element.AreaCode == area_code);}
				});
				
				var len = Object.keys(filter).length;

				var grpcount = 0;
				var curName = '';
				var spcount = 0;
				var classnamesstr = '';
				var curspstr = '';
				var cursizestr = '';
				var curhabstr = '';
				var curdepthstr = '';
				
				var textToInsert = [];
				var i = 0;
				
				if(len > 0){
					$.each(filter, function(index, element){
						
						var curclass = element.Class;
						var curFamily = element.Family;
						var curOrder = element.Order;
						var genspec = element.Genus + ' ' + element.Species;
						//var genspecval = element.Genus + element.Species.slice(0,1).toUpperCase() + element.Species.slice(1) + element.SpecCode +'Fb'+curFamily+curOrder;
						var genspecval = element.Genus + element.Species.slice(0,1).toUpperCase() + element.Species.slice(1) + element.SpecCode +element.Source+curFamily+curOrder;
						var cursize = (element.LengthEstimate) ? parseFloat(element.LengthEstimate) : '';
						var curhabitat = element.Habitat;
						var curdepthshallow = element.DepthRangeShallow;
						var curdepthdeep = element.DepthRangeDeep;
						
						var focalselected ="checked";
						var bgroundselected = "";
						if(element.BackgroundGroup == '1' || element.BackgroundGroup == 1){
							bgroundselected = "checked";
							focalselected = "";
						}
						
						if (curName != element.FuncGroup) {
							
							if(curName != ''){
								grpcountstr = ""+grpcount+"";
								classnamesstr += '</div><div class="overflow-hidden"><img class="imgSize25" src="images/edit.png" onClick="changeClass(\''+grpcount+'\');"></div></td>';
								curspstr += '</div><div class="overflow-hidden"><img class="imgSize25" src="images/edit.png" onClick="changeSpecies(\''+grpcountstr+'\');"></div></td>';
								textToInsert[i++] = classnamesstr;
								textToInsert[i++] = curspstr;
								textToInsert[i++] = cursizestr +'</td>';
								textToInsert[i++] = curhabstr+'</td>';
								textToInsert[i++] = curdepthstr+'</td>';
								textToInsert[i++] = '</tr>';
							}
							curName = element.FuncGroup;
							FuncGroupArr[FuncGroupArrlen++] = curName;						
							grpcount++;
							spcount = 0;
							var grpid = grpcount+"fgroupname";
							var depthid = 'td'+grpcount+'depth';
							
							textToInsert[i++] = '<tr id="group'+grpcount+'">';
							textToInsert[i++] = '<td><div class="center"><input type="checkbox" name="selectedgroup" id="selected'+grpcount+'" value="'+curName+'" onclick="selectFunctionalGroup(this);" checked></div></td>';
							textToInsert[i++] = '<td id="'+grpid+'"><span>'+curName+'</span><div class="floatRight"><img class="imgSize25" src="images/edit.png" onClick="changeFname(\''+grpid+'\');"></div></td>';
							textToInsert[i++] = '<td><div class="center"><input type="radio" name="sample'+grpcount+'" value="fgroup" '+focalselected+'></input></div></td>';
							textToInsert[i++] = '<td><div class="center"><input type="radio" name="sample'+grpcount+'" value="bgroup" '+bgroundselected+'></input></div></td>';
							classnamesstr = '<td id="td'+grpcount+'class">';
							classnamesstr += '<div class="floatLeft width80 overflow-hidden"><input type="checkbox" name="'+grpcount+'class" value="'+curclass+'" id="'+spcount+'td'+grpcount+'class" checked onClick="unSelectClass(this);">'+curclass;
							curspstr = '<td id="td'+grpcount+'species">';
							curspstr += '<div class="floatLeft width80 overflow-hidden">';
							curspstr += '<input type="checkbox" name="'+grpcount+'species" value="'+genspecval+'" id="'+spcount+'td'+grpcount+'species" checked><i>'+genspec+'</i>';
							cursizestr = '<td id="td'+grpcount+'size"><input type="checkbox" class="hide" name="'+grpcount+'size" value="'+cursize+'" id="'+spcount+'td'+grpcount+'size">'+cursize;
							curhabstr = '<td id="td'+grpcount+'habitat"><input type="checkbox" class="hide" name="'+grpcount+'habitat" value="'+curhabitat+'" id="'+spcount+'td'+grpcount+'habitat">'+curhabitat;
							curdepthstr = '<td id="'+depthid+'"><input type="checkbox" class="hide" name="'+grpcount+'depth" value="" id="'+spcount+depthid+'">';
							
							if(curdepthshallow == '' || curdepthshallow == 0){
								if(curdepthdeep == null || curdepthdeep == 0){
									curdepthstr += '<br/>';
								}else{
									curdepthstr += curdepthdeep;
								}
							}else{
								if(curdepthdeep == null || curdepthdeep == 0){
									curdepthstr += curdepthshallow;
								}else{
									curdepthstr += curdepthshallow+ "-" +curdepthdeep;
								}
							}
							curdepthstr += '</span>';
						}else{		// the next species is included in the previous functional group
								
							spcount++;
							
								if(spcount < MAX_Sp_perFuncGroup){
															
								curspstr += '<br/><input type="checkbox" name="'+grpcount+'species" value="'+genspecval+'" id="'+spcount+'td'+grpcount+'species" checked><i>'+genspec+'</i>';
								classnamesstr += '<br/><input type="checkbox" name="'+grpcount+'class" value="'+curclass+'" id="'+spcount+'td'+grpcount+'class" checked onClick="unSelectClass(this);">' + curclass;
								cursizestr += '<br/><input type="checkbox" class="hide" name="'+grpcount+'size" value="'+cursize+'" id="'+spcount+'td'+grpcount+'size">'+cursize;
								curhabstr += '<br/><input type="checkbox" class="hide" name="'+grpcount+'habitat" value="'+curhabitat+'" id="'+spcount+'td'+grpcount+'habitat">'+curhabitat;
								
								curdepthstr += '<br/><input type="checkbox" class="hide" name="'+grpcount+'depth" value="" id="'+spcount+'td'+grpcount+'depth">';
								
								if(curdepthshallow == '' || curdepthshallow == 0){
									if(curdepthdeep == null || curdepthdeep == 0){
									}else{
										curdepthstr += curdepthdeep;
									}
								}else{
									if(curdepthdeep == null || curdepthdeep == 0){
										curdepthstr += curdepthshallow;
									}else{
										curdepthstr += curdepthshallow+"-" + curdepthdeep;
									}
								}
							}
						}
						
						if(index == len-1){
							classnamesstr += '</div><div class="overflow-hidden"><img class="imgSize25" src="images/edit.png" onClick="changeClass(\''+grpcount+'\');"></div></td>';
							curspstr += '</div><div class="overflow-hidden"><img class="imgSize25" src="images/edit.png" onClick="changeSpecies(\''+grpcount+'\');"></div></td>';
							textToInsert[i++] = classnamesstr;
							textToInsert[i++] = curspstr;
							textToInsert[i++] = cursizestr +'</td>';
							textToInsert[i++] = curhabstr+'</td>';
							textToInsert[i++] = '<td id="td'+grpcount+'depth"></td>';
							textToInsert[i++] = '</tr>';
						}
					});
					$('#funcGrptable').append(textToInsert.join(''));
					/*	check if current functional groups has zooplankton and phytoplankton	*/
					
					for(var b=0; b<defaultFunchGroup.length; b++){
						if(FuncGroupArr.indexOf(defaultFunchGroup[b].funcname) === -1){
							grpcount++;
							
							var fnameid = grpcount+"fgroupname";
							
							$('#funcGrptable').append($('<tr>', {
								id: "group"+grpcount	
							}));
							
							var nextTr = '#group'+grpcount;
							
							$(nextTr).append($('<td>'));		//Select or deselect column
							
							var divFname = $('<div>', {
								class: "center"
							});
							
							$(nextTr+' td:last').append(divFname);
							divFname.prepend($('<input>', {
								type: "checkbox",
								name: "selectedgroup",
								id: "selected"+grpcount,
								checked: "checked",
								onclick: "selectFunctionalGroup(this);",
								value: defaultFunchGroup[b].funcname
							}));
							
							$(nextTr).append($('<td>', {		//Functional Group column
								id: fnameid
							}));
							$(nextTr+' td:last').append($('<span>', {
								text: defaultFunchGroup[b].funcname
							}));

							$(nextTr).append($('<td>'));		//Focal Functional Group column
							
							var divFocal = $('<div>', {
								class: "center"
							});
							
							$(nextTr+' td:last').append(divFocal);
							divFocal.prepend($('<input>', {
								type: "radio",
								name: "sample"+grpcount,
								value: "fgroup",
								onClick: "alertCantChange(this);",
								id: "fgroupradio"+grpcount
							}));
							
							$(nextTr).append($('<td>'));		//Background Functional Group column
							
							var divBackground = $('<div>', {
								class: "center"
							});
							
							$(nextTr+' td:last').append(divBackground);
							divBackground.prepend($('<input>', {
								type: "radio",
								name: "sample"+grpcount,
								value: "bgroup",
								id: "bgroupradio"+grpcount,
								checked: "checked"
							}));
							
							$(nextTr).append($('<td>', {		//Class column
								id: "td"+grpcount+"class"
							}));
							
							var divClass = $('<div>', {
								class: "floatLeft width80 overflow-hidden"
							});
							
							$("#td"+grpcount+"class").append(divClass);
							
							$(nextTr).append($('<td>', {		//Species column
								id: "td"+grpcount+"species"
							}));
							
							var divSpecies = $('<div>', {
								class: "floatLeft width80 overflow-hidden"
							});
							
							$("#td"+grpcount+"species").append(divSpecies);
							
							$(nextTr).append($('<td>', {		//Size column
								id: "td"+grpcount+"size"
							}));
							
							$(nextTr).append($('<td>', {		//habitat column
								id: "td"+grpcount+"habitat"
							}));
							
							$(nextTr).append($('<td>', {		//depth column
								id: "td"+grpcount+"depth"
							}));
						}	
					}
				}
			}
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
		if(document.stepForm.faoarea.value == ""){
			alert("Please select a FAO Area!");
			document.stepForm.subcountry.focus();
			return false;
		}
		return true;
	}
}

function populateProp(ctr, gen, sp, a, classname){
	
	var sizeid, habitatid, depthid, category, categoryCap;
	var output = true;
	
	if(gen != '' && gen != null){
		category = 'species';
		categoryCap = 'Species';
	}else{
		category = 'class';
		categoryCap = 'Class';
	}
	
	//get the maximum allowable number of species to add in the functional group
	var nextSp = document.getElementsByName(ctr+"species").length;
	var maxSpToAdd = MAX_Sp_perFuncGroup - parseInt(nextSp);
	
	if(maxSpToAdd <= 0){
		alert("Can't add species!"+"\n"+"The maximum number of species per functional group has been reached.");
		output = false;
	}else{
		$('input[name=new]').remove();
		$('input[name=OKbtn]').remove();
		$('input[name=Cancelbtn]').remove();
		$('#td'+ctr+category+' br:last-child').remove();
	
		var resultData, resultData2;
		$.when(
			$.ajax({
				type: 'GET',
				url: urlForFunctionalGroupsByEcosystem,
				success: function (result) {
					resultData = result;
				}
			}),
			$.ajax({
				type: 'GET',
				url: urlForFunctionalGroupsByCountrySubFAO,
				success: function (result) {
					resultData2 = result;
				}
			})
		).then(function() {
			if(resultData2){
				resultData = resultData.concat(resultData2);
			}
			if(resultData){
				sizeid= 'td'+ctr+'size';
				habitatid = 'td'+ctr+'habitat';
				depthid = 'td'+ctr+'depth';
				classid='td'+ctr+'class';
				var length = '';
				var habitat = '';
				var dshallow = '';
				var ddeep = '';
				var specCode = '';
				var source = '';
				var genus = '';
				var species = '';
				var family = '';
				var order = '';
				var filter;
				var getCount =0;
				
				if(gen != '' && gen != null){
					filter = $.grep(resultData, function(element,index){
						return (element.Genus == gen && element.Species == sp);
					});
					getCount = 1;
					
				}else{ //get species by class name
					
					filter = $.grep(resultData, function(element,index){
						return (element.Class == classname);
					});
					filter.sort(function(a,b){
						var x = a.DataRichness;
						var y = b.DataRichness;
						return y-x;
					});
					
					//get the maximum allowable number of species to add in the functional group
					getCount = maxSpToAdd;		
				}
				
				var len = Object.keys(filter).length;
				
				if (len > 0){
					var uniqueNames = [];
					var uniqueNameslen = 0;
					
					for(var i=0, k=0; k<getCount && i<len; i++, k++){
						var element = filter[i];
						length = element.LengthEstimate;
						habitat = element.Habitat;
						dshallow = element.DepthRangeShallow;
						ddeep = element.DepthRangeDeep;	
						specCode = element.SpecCode;
						className = element.Class;
						source = element.Source;
						genus = element.Genus;
						species = element.Species;
						family = element.Family;
						order = element.Order;
						var genusspecies = genus + " " + species;
						
						if(uniqueNames.indexOf(genusspecies) === -1){
							uniqueNames[uniqueNameslen++] = genusspecies;
								
							if(a > 0){
								$('#'+classid+' div:first-child').append('<br/>');
								$('#td'+ctr+'species div:first-child').append('<br/>');
								$('#'+sizeid).append('<br/>');
								$('#'+habitatid).append('<br/>');
								$('#'+depthid).append('<br/>');
							}
							$('#'+classid+' div:first-child').append('<input type="checkbox" name="'+ctr+'class" value="'+className+'" id="'+a+classid+'" onClick="unSelectClass(this);" checked>'+className);
							$('#'+sizeid).append('<input type="checkbox" class="hide" name="'+ctr+'size" value="'+length+'" id="'+a+sizeid+'">'+length);
							$('#'+habitatid).append('<input type="checkbox" class="hide" name="'+ctr+'habitat" value="'+habitat+'" id="'+a+habitatid+'">'+habitat);
							
							var depthtext = '<input type="checkbox" class="hide" name="'+ctr+'depth" value="" id="'+a+depthid+'">';
							
							if(dshallow == null || dshallow == 0){
								if(ddeep == null || ddeep == 0){
									$('#'+depthid).append(depthtext);
								}else{
									$('#'+depthid).append(depthtext+ddeep);
								}
							}else{
								if(ddeep == null || ddeep == 0){
									$('#'+depthid).append(depthtext+dshallow);
								}else{
									$('#'+depthid).append(depthtext+dshallow+"-" + ddeep);
								}
							}
							//output = out['SpecCode'];		//return speccode
							
							var genspec = genus + species.slice(0,1).toUpperCase() + species.slice(1);
							
							$('#td'+ctr+'species div:first-child').append($('<input>', {
								type: "checkbox",
								name: ctr+"species",
								id: a+"td"+ctr+"species",
								value: genspec+specCode+source+family+order,
								checked: "checked"
							}));
							
							$('#td'+ctr+'species div:first-child').append($('<label>', {
								'for': a+"td"+ctr+"species",
								text: genus + " " + species
							}));
							a++;
						}else{
							k--;
						}
					}
					
					output = false;
				}else if(len == 0){
					alert("Can't find the "+category+"!"+"\n"+"Please go to fishbase.org or sealifebase.org to find alternative matches.");
					
					output = true;
				}
				
				var div = $('<div>', {
					class: "overflow-hidden"
				});
					
				$('#td'+ctr+category).append(div);
				div.prepend($('<img>', {
					class: "imgSize25",
					src: "images/edit.png",
					onClick: "change"+categoryCap+"('"+ctr+"');"
				}));
			}
		});
	}
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

function changeFname(fname){
	$('input[name=new]').remove();
	$('input[name=OKbtn]').remove();
	$('input[name=Cancelbtn]').remove();
	
	var prev = $('#'+fname).text();
	
	$('#'+fname).empty();
	$('#'+fname).append($('<input>', {
		type: "text",
		name: "new",
		value: prev,
		size: "8px",
		onkeypress: "return saveFname('"+fname+"',event.keyCode,'')"
	}));
	
	$('#'+fname).append($('<input>', {
		type: "button",
		value: "OK",
		size: "5px",
		name: "OKbtn",
		onClick: "saveFname('"+fname+"',13,'');"
	}));
	
	$('#'+fname).append($('<input>', {
		type: "button",
		value: "Cancel",
		size: "10px",
		name: "Cancelbtn",
		onClick: "saveFname('"+fname+"',0,'"+prev+"');"
	}));
}

function saveFname(fn,e,prev){
	if(e== 13 || e==0){
		var newFname;
		if(e == 13){
			newFname = $('input[name=new]').val();
			if(newFname.match(/[^A-Za-z]/) || newFname == ''){
				alert("The name of the functional group is not valid!");
				return true;
			}
		}else{
			newFname = prev;
		}
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
			src: "images/edit.png",
			onClick: "changeFname('"+fn+"');"
		}));
	}
}

function changeSpecies(spnum){
	$('input[name=new]').remove();
	$('input[name=OKbtn]').remove();
	$('input[name=Cancelbtn]').remove();
	
	$('#td'+spnum+'species div:nth-child(2)').remove();
	
	var nextSp = document.getElementsByName(spnum+"species").length;
	if(nextSp > 0){
		$('#td'+spnum+'species div:first-child').append("<br>");
	}
	
	$('#td'+spnum+'species div:first-child').append($('<input>', {
		type: "text",
		name: "new",
		size: "8px",
		class: "autocomplete_genSpec",
		onkeypress: "return saveSname('"+spnum+"',event.keyCode)"
	}));
	
	$( ".autocomplete_genSpec" ).autocomplete({
	  source: genSpecArr,
	  minLength: 3
	});
	
	$('#td'+spnum+'species div:first-child').append($('<input>', {
		type: "button",
		value: "OK",
		name: "OKbtn",
		onClick: "return saveSname('"+spnum+"',13);"
	}));
	
	$('#td'+spnum+'species div:first-child').append($('<input>', {
		type: "button",
		value: "Cancel",
		name: "Cancelbtn",
		onClick: "cancelEdit('"+spnum+"','species');"
	}));
}

function cancelEdit(spnum, content){
	$('input[name=new]').remove();
	$('input[name=OKbtn]').remove();
	$('input[name=Cancelbtn]').remove();
	$('#td'+spnum+content+' br:last-child').remove();
	
	var div = $('<div>', {
		class: "overflow-hidden"
	});
	
	$('#td'+spnum+content).append(div);
	var onClickFunc;
	
	if(content=='species'){
		onClickFunc = "changeSpecies('"+spnum+"');";
	}else if(content == 'class'){
		onClickFunc = "changeClass('"+spnum+"');";
	}
	
	$('#td'+spnum+content).append(div);
	div.prepend($('<img>', {
		class: "imgSize25",
		src: "images/edit.png",
		onClick: onClickFunc
	}));
}

function saveSname(snum,e){
	if(e== 13){
		var newSname = $('input[name=new]').val();
		var nextSp = document.getElementsByName(snum+"species").length;
		
		var genspecA = newSname.split(" ");
		
		if(genspecA.length < 2){
			alert("Invalid species name!");
			
			return true;
		}else{
			var gen = genspecA[0].slice(0,1).toUpperCase() + genspecA[0].slice(1).toLowerCase();
			var sp = genspecA[1].toLowerCase();
			
			var result = populateProp(snum, gen, sp, nextSp);
			
			if(result){
				return true;
			}
		}
		return false;
	}		
}

function changeClass(spnum){
	$('input[name=new]').remove();
	$('input[name=OKbtn]').remove();
	$('input[name=Cancelbtn]').remove();
	
	$('#td'+spnum+'class div:nth-child(2)').remove();
	
	var nextSp = document.getElementsByName(spnum+"class").length;
	if(nextSp > 0){
		$('#td'+spnum+'class div:first-child').append("<br>");
	}
	
	$('#td'+spnum+'class div:first-child').append($('<input>', {
		type: "text",
		name: "new",
		size: "8px",
		class: "autocomplete_class",
		onkeypress: "return saveClassname('"+spnum+"',event.keyCode)"
	}));
	
	$( ".autocomplete_class" ).autocomplete({
	  source: classArr,
	  minLength: 2
	});
	
	$('#td'+spnum+'class div:first-child').append($('<input>', {
		type: "button",
		value: "OK",
		name: "OKbtn",
		onClick: "return saveClassname('"+spnum+"',13);"
	}));
	
	$('#td'+spnum+'class div:first-child').append($('<input>', {
		type: "button",
		value: "Cancel",
		name: "Cancelbtn",
		onClick: "cancelEdit("+spnum+",'class');"
	}));
}

function saveClassname(snum,e){
	if(e== 13){
		var newCname = $('input[name=new]').val();
		var nextSp = document.getElementsByName(snum+"class").length;
		
		newCname = newCname.slice(0,1).toUpperCase() + newCname.slice(1).toLowerCase();
		
		var result = populateProp(snum, '', '', nextSp, newCname);
		
		if(result){
			return true;
		}
		
		return false;
	}		
}


function addFGroup(){
	var currgrp = document.getElementsByName("selectedgroup").length;
	NewFunctionalGroup = true;
	
	var nextgrp = parseInt(currgrp) + 1;
	
	var fnameid = nextgrp+"fgroupname";
	
	$('#funcGrptable').append($('<tr>', {
		id: "group"+nextgrp	
	}));
	
	var nextTr = '#group'+nextgrp;
	
	$(nextTr).append($('<td>'));		//Select or deselect column
	
	var divFname = $('<div>', {
		class: "center"
	});
	
	$(nextTr+' td:last').append(divFname);
	divFname.prepend($('<input>', {
		type: "checkbox",
		name: "selectedgroup",
		id: "selected"+nextgrp,
		checked: "checked",
		onclick: "selectFunctionalGroup(this)"
	}));
	
	$(nextTr).append($('<td>', {		//Functional Group column
		id: fnameid
	}));

	$(nextTr).append($('<td>'));		//Focal Functional Group column
	
	var divFocal = $('<div>', {
		class: "center"
	});
	
	$(nextTr+' td:last').append(divFocal);
	divFocal.prepend($('<input>', {
		type: "radio",
		name: "sample"+nextgrp,
		//checked: "checked",
		value: "fgroup",
		onClick: "addNext("+nextgrp+")",
		id: "fgroupradio"+nextgrp
	}));
	
	$(nextTr).append($('<td>'));		//Background Functional Group column
	
	var divBackground = $('<div>', {
		class: "center"
	});
	
	$(nextTr+' td:last').append(divBackground);
	divBackground.prepend($('<input>', {
		type: "radio",
		name: "sample"+nextgrp,
		value: "bgroup",
		onClick: "addNext("+nextgrp+")",
		id: "bgroupradio"+nextgrp
	}));
	
	$(nextTr).append($('<td>', {		//Class column
		id: "td"+nextgrp+"class"
	}));
	
	var divClass = $('<div>', {
		class: "floatLeft width80 overflow-hidden"
	});
	
	$("#td"+nextgrp+"class").append(divClass);
	
	$(nextTr).append($('<td>', {		//Species column
		id: "td"+nextgrp+"species"
	}));
	
	var divSpecies = $('<div>', {
		class: "floatLeft width80 overflow-hidden"
	});
	
	$("#td"+nextgrp+"species").append(divSpecies);
	
	$(nextTr).append($('<td>', {		//Size column
		id: "td"+nextgrp+"size"
	}));
	
	$(nextTr).append($('<td>', {		//habitat column
		id: "td"+nextgrp+"habitat"
	}));
	
	$(nextTr).append($('<td>', {		//depth column
		id: "td"+nextgrp+"depth"
	}));

	changeFname(fnameid);
}

function addNext(grpCount){

	var focalorbground = $("input[name='sample"+grpCount+"']:checked").val();
	
	$('#bgroupradio'+grpCount).attr('onclick',null).unbind('click');
	$('#fgroupradio'+grpCount).attr('onclick',null).unbind('click');
	
	if(focalorbground == "bgroup"){
		changeClass(grpCount);
	}else{
		changeSpecies(grpCount);
	}
	
}

function validateformGroup(){
	var ctr2 = 1;
	var bgroupcount = 0;
	var fgroupcount = 0;
	
	$("#ftable").find("tr:gt(0)").remove();
	$("#btable").find("tr:gt(0)").remove();
	
	while(($("#selected"+ctr2).length) > 0){
		ctr2++;
	}	
	ctr2 = ctr2 - 1;
	
	//while(($("#selected"+ctr).length) > 0){
	//for(var ctr=1; ctr <= count; ctr++){
	//	if($("#selected"+ctr).is(':checked')){
	//		if($("input[name='sample"+ctr+"']:checked").val() == "fgroup"){
	//			fgroupcount++;
	//		}
	//		if($("input[name='sample"+ctr+"']:checked").val() == "bgroup"){
	//			bgroupcount++;
	//		}
	//		ctr++;
	//	}
	//}
	
	for(var ctr=1; ctr <= ctr2; ctr++){
		if($("#selected"+ctr).is(':checked')){
			if($("input[name='sample"+ctr+"']:checked").val() == "fgroup"){
				fgroupcount++;
			}
			if($("input[name='sample"+ctr+"']:checked").val() == "bgroup"){
				bgroupcount++;
			}
			//ctr++;
		}
	}
	
	if(fgroupcount > 0 && bgroupcount > 0){
		separateFocalandBackground(fgroupcount, bgroupcount);
		return true;
	}else if(fgroupcount == 0){
		alert("Please select at least one focal functional group.");
		return false;
	}else if(bgroupcount == 0){
		alert("Please select at least one background functional group.");
		return false;
	}
	return true;
}

function separateFocalandBackground(fgroupcnt, bgroupcnt){
	var ctr = 1;
	var forder = 1;
	var border = 1;
	var focalhtml = "";
	var backgroundhtml = "";
	
	while($("#selected"+ctr).length > 0){
		if($("#selected"+ctr).is(':checked')){
			
			var group1 = document.getElementsByName(ctr+"species");
			var len1 = group1.length;
			var funcgroupid = ctr+'fgroupname';
			var gname = $('#'+funcgroupid+' span').text();
			
			var funcgrouphtml = "<td>"+gname+"</td>";
			var specieshtml = "<td>";
			
			for(var a=0; a<len1; a++){
				if(group1[a].checked){
					var genspec = group1[a].value.match(/[A-Z]?[a-z]+|[0-9]+/g);
					var gen = genspec[0];	//genus
					var sp = genspec[1];	//species
					
					var nameofspec = gen+' '+sp.slice(0,1).toLowerCase() + sp.slice(1);
					
					specieshtml += "<i>"+ nameofspec + "</i><br/>";
				}
			}
			specieshtml += "</td>";
			
			if($("input[name='sample"+ctr+"']:checked").val() == "fgroup"){
				
				var dropdownhtmlfocal = "<td><select name='focalfuncgrouporder'>";
				for(var k=1; k<=fgroupcnt; k++){
					if(k==forder){
						dropdownhtmlfocal += "<option value='"+k+"_"+ctr+"' selected>"+k+"</option>";
					}else{
						dropdownhtmlfocal += "<option value='"+k+"_"+ctr+"'>"+k+"</option>";
					}
				}
				dropdownhtmlfocal += "</select></td>";
				forder++;
				focalhtml += "<tr>"+dropdownhtmlfocal+funcgrouphtml+specieshtml+"</tr>";
				
			}else{
				var dropdownhtmlback = "<td><select name='backgroundfuncgrouporder'>";
				for(var j=1; j<=bgroupcnt; j++){
					if(j==border){
						dropdownhtmlback += "<option value='"+j+"_"+ctr+"' selected>"+j+"</option>";
					}else{
						dropdownhtmlback += "<option value='"+j+"_"+ctr+"'>"+j+"</option>";
					}
				}
				dropdownhtmlback += "</select></td>";
				border++;
				backgroundhtml += "<tr>"+dropdownhtmlback+funcgrouphtml+specieshtml+"</tr>";
			}
		}
		ctr++;
	}

	$('#ftable tr:last').after(focalhtml);
	$('#btable tr:last').after(backgroundhtml);
}

function validateStep(){
	var steps = $('#stepsInput').val();

	if(steps == ""){
		alert("Please enter a valid number.");
		return false;
	}else return true;
}

function getOrderThenSort(elementName){
	var tempArr = [];
	var orderEls = document.getElementsByName(elementName);
	for(var t=0; t<orderEls.length; t++){
		tempArr[t] = orderEls[t].value;
	}
	
	tempArr.sort(function(a,b) {
		return a.split('_')[0] - b.split('_')[0];
	});
	
	return tempArr;
}

function convertGroupsIntoJSON(funcgr, sortArray, combineArr, resultData){
	
	for(var b=0; b<sortArray.length; b++){
		var ctr = sortArray[b].split('_')[1];	
		
		var group1 = document.getElementsByName(ctr+"species");
		var len1 = group1.length;
		var gname = $('#'+ctr+'fgroupname span').text();
	
		//var fgroup = ($("input[name='sample"+ctr+"']:checked").val() == "fgroup" ? "focal" : "background");
		var taxaArr = [];
		var genusList = [];
		var famList = [];
		var ordList = [];
		
		var taxaArrlen = 0;
		var genusListlen = 0;
		var famListlen = 0;
		var ordListlen = 0;
		
		for(var a=0; a<len1; a++){
			if(group1[a].checked){
				var genspec = group1[a].value.match(/[A-Z]?[a-z]+|[0-9]+/g);
				var gen = genspec[0];	//genus
				
				//https://github.com/jhpoelen/fb-osmose-bridge/issues/177
				if (isNaN(genspec[2])){
					var sp = genspec[1] +" "+ genspec[2];	//species
					var id = genspec[3];	// speccode
					var link = (genspec[4] == "Fb" ? "http://fishbase.org/summary/"+id : "http://sealifebase.org/summary/"+id); 	//fb or slb
					var fam = genspec[5];
					var order = genspec[6];
				} else {
					var sp = genspec[1];	//species
					var id = genspec[2];	// speccode
					var link = (genspec[3] == "Fb" ? "http://fishbase.org/summary/"+id : "http://sealifebase.org/summary/"+id); 	//fb or slb
					var fam = genspec[4];
					var order = genspec[5];
				}
				
				var nameofspec = gen+' '+sp.slice(0,1).toLowerCase() + sp.slice(1);
				
				if(genusList.indexOf(gen) === -1){
					genusList[genusListlen++] = gen;
				}
				
				if(famList.indexOf(fam) === -1){
					famList[famListlen++] = fam;
				}
				
				if(ordList.indexOf(order) === -1){
					ordList[ordListlen++] = order;
				}
				
				taxaArr[taxaArrlen++] = {"name": nameofspec, "url": link};
			}
		}
		

    if(resultData){
      var filter = $.grep(resultData, function(element,index){
        return (genusList.indexOf(element.Genus) > 0 || famList.indexOf(element.Family) > 0 || ordList.indexOf(element.Order) > 0);
      });

      filter.sort(function(a,b){
        var x = a.DataRichness;
        var y = b.DataRichness;
        return y-x;
      });

      var len = Object.keys(filter).length;

      if (len > 0){
        for(var i=0; i<len; i++){
          var e = filter[i];
          var gen = e.Genus;
          var spec = e.Species;
          var nameofspec = gen+' '+spec.slice(0,1).toLowerCase() + spec.slice(1);

          var item = $.grep(taxaArr, function(item) {
            return item.name == nameofspec;
          });
          if(!(item.length)){
            var specCode = e.SpecCode;
            var link = (e.Source == "Fb" ? "http://fishbase.org/summary/"+specCode : "http://sealifebase.org/summary/"+specCode);

            taxaArr[taxaArrlen++] = {"name": nameofspec, "url": link, "selectionCriteria": "implicit"};
          }
        }
      }
    }

		combineArrlen = combineArr.length;
		combineArr[combineArrlen++] = {
			"name": gname,
			"type": funcgr,
			"taxa": taxaArr
		};
	}
	return combineArr;
}

function download(){
	/*change status label to process ongoing */
	var statusLabel = $('#status');
	statusLabel.empty();
	statusLabel.append("Preparing configuration...");
	statusLabel.css('color', 'black');
	
	var downloadEl = $('#downloadLink');
	downloadEl.html("&nbsp;");
	
	//time steps per year
	var steps = $('#stepsInput').val();
	
	//compile data
	var jsonCombineData = [];
	
	var focalArr = getOrderThenSort('focalfuncgrouporder');
	var bgArr = getOrderThenSort('backgroundfuncgrouporder');

  var resultData1, resultData2, resultData3;
  $.when(
          $.ajax({
            type: 'GET',
            url: urlForFunctionalGroupsByEcosystem,
            success: function (result1) {
              resultData1 = result1;
            }
          }),
          $.ajax({
            type: 'GET',
            url: urlForFunctionalGroupsByCountryFAO,
            success: function (result2) {
              resultData2 = result2;
            }
          }),
          $.ajax({
            type: 'GET',
            url: urlForFunctionalGroupsByCountrySubFAO,
            success: function (result3) {
              resultData3 = result3;
            }
          })
      ).then(function() {
        var resultData = resultData1.concat(resultData2);
        resultData = resultData.concat(resultData3);

	jsonCombineData = convertGroupsIntoJSON('focal_functional_group', focalArr, jsonCombineData, resultData);
	jsonCombineData = convertGroupsIntoJSON('biotic_resource', bgArr, jsonCombineData, resultData);
	
	var config = {
        "timeStepsPerYear" : steps,
        "groups" : jsonCombineData
    };

	osmose.generateConfig(config, function(err, url) {
    statusLabel.empty();
    if (url != null) {
			statusLabel.append("Done preparing configuration");
			
			downloadEl.text("Click here to download Osmose configuration");
			downloadEl.attr("download", "osmose_config.zip");
			downloadEl.attr("href", url);
			
		} else {
			statusLabel.append("Generating configuration is not successful.");
			statusLabel.css('color', 'red');
			
			var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(config));
			
			downloadEl.text("Click here to download the configuration JSON");
			downloadEl.attr("download", "generated_config.json");
			downloadEl.attr("href", "data:'"+data + "'");
		}
    });
   });
	return false;
}
