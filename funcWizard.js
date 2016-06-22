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
		
	}else{
		document.getElementById("group"+groupNum).style.backgroundColor = "LightGrey";
		document.getElementsByName("sample"+groupNum)[0].disabled = true;
		document.getElementsByName("sample"+groupNum)[1].disabled = true;
	
		var spcount = document.getElementsByName(groupNum+"species").length;
		for(var a=0; a<spcount; a++){
			document.getElementsByName(groupNum+"species")[a].disabled = true;
			document.getElementsByName(groupNum+"species")[a].checked = false;
		}
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


function save(){
	var groupctr = 1;
	var grp = document.getElementsByName("selectedgroup");

	var json;
	var cat;

	for(var i=0; i<grp.length; i++){
		if(grp[i].checked == true){
			
			var grpctr = $(grp[i]).attr('id');
			var groupNum = grpctr.slice(-1);
			
			var grpchoice = $("input[name=sample"+groupNum+"]:checked").val();
			
			if(grpchoice == "fgroup"){
				cat = "Focal Functional Group";
			}else{
				cat = "Background Functional Group";
			}
			
			var checkedSpecies = $('input[name='+groupNum+'species]:checked').map(function(){
				return this.value;
			}).get().join(',');
			
			json = '{"Functional Group": "'+ $(grp[i]).val() +'", "Category": "'+cat+'", "Species": "' + checkedSpecies + '" }';
			
		}
	}
	return true;
}