<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" >
<head>
<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<title>FB-Osmose Bridge</title>
<link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/smoothness/jquery-ui.css">
<link rel="stylesheet" href="scripts/screen.css" type="text/css">
<script type="text/javascript" src="scripts/jquery.min.js"></script>
<script type="text/javascript" src="scripts/formToWizard.js"></script>
<script type="text/javascript" src="scripts/fb-osmose-bridge.js"></script>
<script type="text/javascript" src="scripts/underscore-min.js"></script>
<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
<script src="scripts/funcWizard.js"></script>
<script type="text/javascript">
$(document).ready(function(){
	$("#stepForm").formToWizard({ submitButton: 'submitBtn' });
	//$( "#ftabletbody" ).sortable();
	//$( "#btabletbody" ).sortable();
});
//});
</script>
</head>
<body>
	<div id="main">
	<form action="" method="post" id="stepForm" name="stepForm" onsubmit="return download()">
		<fieldset>
		<legend>Step 1: Getting parameter estimates for your OSMOSE model</legend>
		<div id="container">
		<p class="justify13">You are about to query parameter estimates for your OSMOSE model.</p>

		<p class="justify13">To get started, please select an ecosystem or a combination of a country and FAO area.</p>
		
		<div id="selectecosystem">
			<div class="floatLeft width5">
				<input type="radio" name="choose" id="eco" value="eco" checked onchange="changeEcoOrCountry()"></input>
			</div>
			<div class="padTop10" id="ecoDiv">
				<div class="w200 floatLeft">
					 <b><i>Ecosystem</i></b> 
				</div>
				<select name="ecosystem" id="ecosystem" onchange="populateFuncTable()" title="Please select ecosystem!">
					<option value="" selected="selected">Select</option>
				</select>
				<span class="required"> * Required</span>
			</div>
		</div>
			<hr>
		<div id="selectcountry">
			<div class="floatLeft width5">
				<input type="radio" name="choose"  value="cntry" onchange="changeEcoOrCountry()"></input>
			</div>
			<div class="overflow-hidden" id="countryDiv">
				<div class="padTop10">
					<div class="w200 floatLeft">
						 <b><i>Country</i></b> 
					</div>
					<select name="country" id="country" onchange="listSubCountry()" title="Please select country!" disabled>
						<option value="">Select</option>
					</select>
					<span class="required"> * Required</span>
				</div>
				<div class="padTop10">
					<div class="w200 floatLeft">
						 <b><i>State/Province</i></b> 
					</div>
					<select name="subcountry" id="subcountry" onchange="listFao(true)" title="Please select sub-country!" disabled>
						<option value="" selected="selected">Select</option>
					</select>
				</div>
				<div class="padTop10">
					<div class="w200 floatLeft">
						 <b><i>FAO Area</i></b> 
					</div>
					<select name="faoarea" id="faoarea" onchange="populateFuncTable()" title="Please select FAO area!" disabled>
						<option value="" selected>Select</option>
					</select>
					<span class="required"> * Required</span>
				</div>
			</div>
		</div>
		</fieldset>
		<fieldset>
		<legend>Reorganize functional groups</legend>
		<div id="container">
		<p class="justify13 padTop10">FishBase/SealifeBase defined functional groups for you</p>
		
		<p class="justify13 padTop10"> Please feel free to: </p>
		
		<p class="justify13"><b>(1)</b> Indicate whether each functional group is a focal functional group or a background functional group, using dedicated radio buttons. <img onClick="msgpop(1)" id="info1" class="imgSize25" src="images/info.png"></p>
		<div class="messagepop pop" id="message1">
			<p>Focal functional groups are groups of species/species which are explicitly considered in OSMOSE (i.e., their whole life cycle is modeled), while background functional groups are groups of species/species which are implicitly considered in OSMOSE (fields of biomass for these groups are used to force the OSMOSE model). </p>
			<p>By default, FishBase/SeaLifeBase defined all functional groups as focal functional groups, except the phytoplankton and zooplankton groups; the phytoplankton and zooplankton groups can only be defined as background functional groups.</p>
			<input type="button" class="close" onClick="deselect(1)" name="okbutton" value="OK"></input>
		</div>
		
		<p class="justify13"><b>(2)</b> Remove species from some functional groups.
		<img onClick="msgpop(2)" id="info2" class="imgSize25" src="images/info.png"></p>
		<div class="messagepop pop" id="message2">
			<p>To remove a species from a given functional group, deselect it from the column "Species" using the dedicated radio button.</p>
			<p>To remove all the species belonging to the same class from a given functional group, deselect the class from the column "Class" using the dedicated radio button; this action will deselect all the species belonging to the class from the column "Species" of the functional group.</p>
			<input type="button" class="close" onClick="deselect(2)" name="okbutton" value="OK"></input>
		</div>
		
		<p class="justify13"><b>(3)</b> Redistribute species between functional groups. <img onClick="msgpop(3)" id="info3" class="imgSize25" src="images/info.png"></p>
		<div class="messagepop pop" id="message3">
			<p>To redistribute species between two functional groups: </p>
			<p>(i) Deselect a species from the column "Species" of its original functional group using the dedicated radio button.</p> 
			<p>(ii) Then: In the column "Species" of the functional group in which you wish to reallocate the species, press the Edit button (<img class="imgSize25" src="images/edit.png">) and type the name of the species (Latin name); suggestions will be provided to you as you start typing something.</p>
			<p>OR</p>
			<p>(i) FOR BACKGROUND FUNCTIONAL GROUPS ONLY: Deselect a given class from the column "Class" of its original functional group using the dedicated radio button; this action will deselect all the species belonging to the class from the column "Species" of the original functional group.</p>
			<p>(ii) Then: In the column "Class" of the functional group in which you wish to reallocate the species, press the Edit button (<img class="imgSize25" src="images/edit.png">) and type the name of the class; suggestions will be provided to you as you start typing something. Once the class name is entered, the species belonging to that class will automatically appear in the "Species" column of the new functional group.</p>
			<input type="button" class="close" onClick="deselect(3)" name="okbutton" value="OK"></input>
		</div>
		
		<p class="justify13"><b>(4)</b> Remove functional groups from the table. <img onClick="msgpop(4)" id="info4" class="imgSize25" src="images/info.png"></p>
		<div class="messagepop pop" id="message4">
			<p>To remove functional groups from the table, use the radio buttons of the "Select/deselect" column.</p>
			<input type="button" class="close" onClick="deselect(4)" name="okbutton" value="OK"></input>
		</div>
		
		<p class="justify13"><b>(5)</b> Create functional groups. <img onClick="msgpop(5)" id="info5" class="imgSize25" src="images/info.png"></p>
		<div class="messagepop pop" id="message5">
			<p>To create a new functional group, press the Plus button at the bottom of the table (<img class="imgSize25" src="images/add.png">).</p>
			<p>Then:</p> 
			<p>(i) Enter the name of the new functional group.</p>
			<p>(ii) Indicate whether the new functional group is a focal functional group or a background functional group, using dedicated radio buttons;</p> 
			<p>(iii) In the column "Species", type the name of the different species making up the new functional group (Latin names); suggestions will be provided to you as you start typing something.</p>
			<p>OR</p>
			<p>(iii) FOR BACKGROUND FUNCTIONAL GROUPS ONLY: In the column "Class", type the name of the different classes making up the new functional group; suggestions will be provided to you as you start typing something. Once a class name is entered, the species belonging to that class will automatically appear in the "Species" column of the new functional group.</p>
			<p>*Note: To identify relevant Latin names or class names for the new functional group, you can access FishBase/SealifeBase by clicking on the FishBase icon or the SealifeBase icon, which are both located at the top-right hand corner of the table provided below. FishBase provides data for fish, while SealifeBase provides data for all the other types of marine organisms.</p>
			<input type="button" class="close" onClick="deselect(5)" name="okbutton" value="OK"></input>
		</div>
		
		<p class="justify13"><b>(6)</b> Rename functional groups. <img onClick="msgpop(6)" id="info6" class="imgSize25" src="images/info.png"></p>
		<div class="messagepop pop" id="message6">
			<p>To rename a functional group, press the Edit button (<img class="imgSize25" src="images/edit.png">) at the right of the functional group name. </p>
			<input type="button" class="close" onClick="deselect(6)" name="okbutton" value="OK"></input>
		</div>
		
		<p class="justify13 padTop10">*Caution: The name of the functional groups should not include spaces nor underscores. For example, "SmallPelagics" is a valid functional group name, but not "Small pelagics" nor "Small_pelagics".</p>

		<p class="justify13 padTop10">When you are ready, press Proceed to go to the next step.</p>
		
		<div class="padTop10 padBottom10 autooverflow relativeposition">
		<a href="http://sealifebase.org"  target="_blank"><img class="imgSize50 floatRight" src="images/SeaLifeLogo.gif"></a>
		<a href="http://fishbase.org" target="_blank"><img class="imgSize50 floatRight" src="images/FBLogo_s.gif"></a>
		</div>
		
		<table class="padTop10 collapse" border="1" id="funcGrptable">
			<th class="width5">Select/ deselect</th>
			<th class="width13">Functional Group</th>
			<th class="width5">Focal Functional Group</th>
			<th class="width7">Background Functional Group</th>
			<th class="width13">Class</th>
			<th>Species</th>
			<th class="width7">Maximum length (cm)</th>
			<th class="width13">Habitat</th>
			<th class="width10">Depth</th>
		</table>
		<div class="padTop10"> 
			<div class="floatleft">
			<img class="imgSize25" id="addImage" src="images/add.png" onClick="addFGroup();">
			</div>
		</div>
		</fieldset>
		<fieldset>
			<legend>Order Focal functional groups</legend>
			<div id="container">
				<p class="justify13">Please order focal functional groups</p>
				<div class="padTop10" name="focaldiv">
					<table class="padTop10 collapse" width="100%" border="1" id="ftable">
					<tbody id="ftabletbody">
					<th></th>
					<th>Focal Functional Group</th>
					<th>Species</th>
					</tbody>
					</table>
				</div>
			</div>
		</fieldset>
		<fieldset>
			<legend>Order Background functional groups</legend>
			<div id="container">
				<p class="justify13">Please order background functional groups</p>
				<div class="padTop10" name="backgrounddiv">
					<table class="padTop10 collapse" width="100%" border="1" id="btable">
					<tbody id="btabletbody">
					<th></th>
					<th>Background Functional Group</th>
					<th>Species</th>
					</tbody>
					</table>
				</div>
			</div>
		</fieldset>
		<fieldset>
			<legend>Indicate the time step of your OSMOSE model</legend>
			<div id="container">
				<p class="justify13">Please indicate the number of time steps per year of your OSMOSE model.</p>
					<center>
					<table class="padTop10 padBottom10 width80">
						<td><input type="text" name="steps" id="stepsInput">
						<span class="required">* </span>
						</td>
						<td><div class="top"> e.g,</div></td>
						<td class="width70">12 if your OSMOSE model has a monthly time step,
						<br>24 if your OSMOSE model has a 2-week time step,
						<br>4 if your OSMOSE model has a quarterly time step, etc.</td>
					</table>
					</center>
				<p class="justify13">Once you have entered a value in the box above, press Proceed to reach the final page of this user interface, where you will be able to download configuration files for your OSMOSE model.</p>
				<span class="required"> * Required</span>
			</div>
		</fieldset>
		<fieldset>
			<legend>Download configuration files for your OSMOSE model</legend>
			<div id="container">
				<p class="justify13">We now have all the necessary information to generate configuration files for your OSMOSE model. These configuration files are compatible with OSMOSE 3 Update 2, which is available for download here: <a href="http://www.osmose-model.org/downloads">http://www.osmose-model.org/downloads</a></p>
				
				<p class="justify13">When you are ready, press "Submit". You will then get a zip file containing (1) all the OSMOSE configuration files; (2) a file called “functional_groups.csv”, which lists the species making up each of the functional groups of your OSMOSE model; and (3) a README file detailing which parameter estimates were obtained through FishBase/SeaLifeBase and which parameter estimates remain to be entered by you.</p>
				
				<p class="justify13">*For technical assistance on OSMOSE, please contact Nicolas Barrier (nicolas.barrier@ird.fr) or post a question on: <a href="http://www.osmose-model.org/forum">http://www.osmose-model.org/forum</a>.</p>
				
				<p class="justify13"><font color="FF0000">Please be patient. The generation of your zip file may take a while.</font></p>
				
				<p><label id="status"> &nbsp; </label></p>
				<p><a id="downloadLink"> &nbsp; </a></p>
				
			</div>
		</fieldset>
		<div class="padTop10">
			<input type="submit" id="submitBtn" name="submitBtn" value="Submit"/>
			<!--<input type="button" name="exit" value="Exit" onClick="parent.location='step1.html'"></input>-->
		</div>
	</div>
	</form>
</div>
</body>
</html>
