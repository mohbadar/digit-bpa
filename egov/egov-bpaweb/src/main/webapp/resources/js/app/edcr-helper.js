/*
 * eGov suite of products aim to improve the internal efficiency,transparency,
 *    accountability and the service delivery of the government  organizations.
 *
 *     Copyright (C) <2017>  eGovernments Foundation
 *
 *     The updated version of eGov suite of products as by eGovernments Foundation
 *     is available at http://www.egovernments.org
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with this program. If not, see http://www.gnu.org/licenses/ or
 *     http://www.gnu.org/licenses/gpl.html .
 *
 *     In addition to the terms of the GPL license to be adhered to in using this
 *     program, the following additional terms are to be complied with:
 *
 *         1) All versions of this program, verbatim or modified must carry this
 *            Legal Notice.
 *
 *         2) Any misrepresentation of the origin of the material is prohibited. It
 *            is required that all modified versions of this material be marked in
 *            reasonable ways as different from the original version.
 *
 *         3) This license does not grant any rights to any user of the program
 *            with regards to rights under trademark law for use of the trade names
 *            or trademarks of eGovernments Foundation.
 *
 *   In case of any queries, you can reach eGovernments Foundation at contact@egovernments.org.
 */

$(document).ready(
    function ($) {

        String.prototype.compose = (function (){
            var re = /\{{(.+?)\}}/g;
            return function (o){
                return this.replace(re, function (_, k){
                    return typeof o[k] != 'undefined' ? o[k] : '';
                });
            }
        }());

        // To calculate and set SUM on edit mode for existing buildings
        var existingBldgLen = $('.existBuilding').data('bldg-len');
        if(existingBldgLen > 0)
            for(var i = 0; i < existingBldgLen; i++)
                validateAndCalculateSumForDCRFloorDetails('.existingBuildingAreaDetails'+i, i);

        // To calculate and set SUM on edit mode for proposed buildings
        var proposedBldgLen = $('.edcrBuildDetails').data('bldg-len');
        if(proposedBldgLen > 0)
            for(var i = 0; i < proposedBldgLen; i++)
                validateAndCalculateSumForDCRFloorDetails('.edcrBuildingAreaDetails'+i, i);

        // Table header, body and footer reused for both proposed and existing buildings
        //***********START - Auto populate proposed buildings details*********************

        var $table;

        var thead = '<thead><tr>'+
            '<th class="text-center">Srl.no</th>'+
            '<th class="text-center dcr-floor-toggle-mandatory">Floor Description</th>'+
            '<th class="text-center dcr-floor-toggle-mandatory">Level</th>'+
            '<th class="text-center dcr-floor-toggle-mandatory">Occupancy/Sub Occupancy</th>'+
            '<th class="text-center dcr-floor-toggle-mandatory">Builtup Area (m²)</th>'+
            '<th class="text-center dcr-floor-toggle-mandatory">Floor Area (m²)</th>'+
            '<th class="text-center dcr-floor-toggle-mandatory">Carpet Area (m²)</th>'+
        '</tr></thead>';

        var tbody = '<tbody></tbody>';

        var row = '<tr>'+
            '<td class="text-center"><span class="serialNo text-center" id="slNoInsp">{{sno}}</span><input type="hidden" class="orderNo" data-sno name="buildingDetailFromEdcr[{{bldgIdx}}].buildingFloorDetailsByEdcr[{{idx}}].orderOfFloor" value="{{orderOfFloor}}"/></td>'+
            '<td ><select name="buildingDetailFromEdcr[{{bldgIdx}}].buildingFloorDetailsByEdcr[{{idx}}].floorDescription" data-first-option="false" id="buildingFloorDetailsByEdcr[{{idx}}]floorDescription" class="form-control dcr-floor-details-mandatory floorDescription{{bldgIdx}} clear-details" disabled="true" maxlength="128" > <option value="{{floorDesc}}">{{floorDesc}}</option></select></td>'+
            '<td class="text-right"><input type="text" class="form-control table-input text-center patternvalidation floorNumber{{bldgIdx}} dcr-floor-details-mandatory clear-details" name="buildingDetailFromEdcr[{{bldgIdx}}].buildingFloorDetailsByEdcr[{{idx}}].floorNumber" data-pattern="number" id="buildingFloorDetailsByEdcr[{{idx}}]floorNumber" value="{{floorNo}}" maxlength="3" disabled="true" /></td>'+
            '<td ><select name="buildingDetailFromEdcr[{{bldgIdx}}].buildingFloorDetailsByEdcr[{{idx}}].subOccupancy" data-first-option="false" id="buildingFloorDetailsByEdcr[{{idx}}]occupancy" class="form-control dcr-floor-details-mandatory{{bldgIdx}} occupancy{{bldgIdx}}" maxlength="128" disabled="true"> <option value="{{occupancyId}}">{{occupancyDesc}}</option></select></td>'+
            '<td class="text-right"><input type="text" class="form-control table-input text-right patternvalidation dcrPlinthArea{{bldgIdx}} dcr-floor-details-mandatory editable nonzero decimalfixed" data-pattern="decimalvalue" name="buildingDetailFromEdcr[{{bldgIdx}}].buildingFloorDetailsByEdcr[{{idx}}].plinthArea" id="buildingFloorDetailsByEdcr[{{idx}}]plinthArea" value="{{plinthArea}}" maxlength="10" onblur="validateDCRFloorDetails(this)" required="required" disabled="true" /></td>'+
            '<td class="text-right"><input type="text" class="form-control table-input text-right patternvalidation dcrFloorArea{{bldgIdx}} dcr-floor-details-mandatory editable decimalfixed" data-pattern="decimalvalue" name="buildingDetailFromEdcr[{{bldgIdx}}].buildingFloorDetailsByEdcr[{{idx}}].floorArea" id="buildingFloorDetailsByEdcr[{{idx}}]floorArea" value="{{floorArea}}" maxlength="10" required="required" disabled="true" /></td>'+
            '<td class="text-right"><input type="text" class="form-control table-input text-right patternvalidation dcrCarpetArea{{bldgIdx}} dcr-floor-details-mandatory editable decimalfixed" data-pattern="decimalvalue" name="buildingDetailFromEdcr[{{bldgIdx}}].buildingFloorDetailsByEdcr[{{idx}}].carpetArea" id="buildingFloorDetailsByEdcr[{{idx}}]carpetArea" value="{{carpetArea}}" maxlength="10" required="required" disabled="true" /></td>'+
        '</tr>';

        var tfoot = '<tfoot><tr>'+
            '<td></td>'+
            '<td></td>'+
            '<td></td>'+
            '<td class="text-right">Total</td>'+
            '<td class="text-right dcr-reset-values"></td>'+
            '<td class="text-right dcr-reset-values"></td>'+
            '<td class="text-right dcr-reset-values"></td>'+
        '</tr></tfoot>';

        var otherBldgDetails = '<div class="edcrBuildingAreaDetails{{bldgIdx}}"><div class="form-group">' +
            '        <label' +
            '                class="col-sm-3 control-label text-right show-hide totalPlintArea">' +
            '                Total Builtup Area (m²)<span class="mandatory"></span> </label> <label' +
            '            class="col-sm-3 control-label text-right show-hide demolition">' +
            '            Demolition Area (m²)<span class="mandatory"></span> </label><label' +
            '            class="col-sm-3 control-label text-right show-hide noofhutorshed">' +
            '            Area of the Hut/Shed (m²) <span class="mandatory"></span> </label> <label' +
            '            class="col-sm-3 control-label text-right show-hide alterationInArea">' +
            '            Alteration/Change in Area (m²) <span class="mandatory"></span> </label> <label' +
            '            class="col-sm-3 control-label text-right show-hide additionInArea">' +
            '            Addition or Extension in Area (m²) <span class="mandatory"></span> </label> <label' +
            '            class="col-sm-3 control-label text-right show-hide changeInOccupancyArea">' +
            '            Change in Occupancy Area (m²) <span class="mandatory"></span>' +
            '    </label>' +
            '        <div class="col-sm-3 add-margin">' +
            '            <input type="hidden" id="name" name="buildingDetail[{{bldgIdx}}].name"' +
            '                   value="{{name}}">' +
            '            <input type="hidden" id="number" name="buildingDetail[{{bldgIdx}}].number"' +
            '                   value="{{number}}">' +
            '            <input type="hidden" id="name" name="buildingDetailFromEdcr[{{bldgIdx}}].name"' +
            '                   value="{{name}}">' +
            '            <input type="hidden" id="number" name="buildingDetailFromEdcr[{{bldgIdx}}].number"' +
            '                   value="{{number}}">' +
            '            <input type="hidden" id="setTotalPlintArea{{bldgIdx}}" name="buildingDetail[{{bldgIdx}}].totalPlintArea"' +
            '                   value="{{totalPlinthArea}}">' +
            '            <input' +
            '                    class="form-control patternvalidation dcr-reset-values decimalfixed totalPlintAreaFromEdcr"' +
            '                    maxlength="10" data-pattern="decimalvalue" id="totalPlintAreaFromEdcr{{bldgIdx}}"' +
            '                    name="buildingDetailFromEdcr[{{bldgIdx}}].totalPlintArea"' +
            '                    value="{{totalPlinthArea}}" disabled="true"/>' +
            '        </div>' +
            '        <label' +
            '                class="col-sm-2 control-label text-right floorCount">' +
            '                Number of Floors<span class="mandatory"></span></label>' +
            '        <div class="col-sm-3 add-margin">' +
            '            <input type="hidden" id="setFloorCount" name="buildingDetail[{{bldgIdx}}].floorCount"' +
            '                   value="{{floorCount}}">' +
            '            <input' +
            '                    class="form-control patternvalidation dcr-reset-values floorCount{{bldgIdx}}"' +
            '                    data-pattern="number" maxlength="3" id="floorCountFromEdcr{{bldgIdx}}" readonly="true"' +
            '                    name="buildingDetailFromEdcr[{{bldgIdx}}].floorCount" value="{{floorCount}}"/>' +
            '        </div>' +
            '    </div>' +
            '' +
            '    <div class="form-group">' +
            '        <label' +
            '                class="col-sm-3 control-label text-right heightFromGroundWithOutStairRoom{{bldgIdx}}">' +
            '                Height From Ground Level without mumty (In Mtrs)<span class="mandatory"></span></label>' +
            '        <div class="col-sm-3 add-margin">' +
            '            <input type="hidden" id="setHeightFromGroundWithOutStairRoom{{bldgIdx}}"' +
            '                   name="buildingDetail[{{bldgIdx}}].heightFromGroundWithOutStairRoom"' +
            '                   value="{{height}}">' +
            '            <input' +
            '                    class="form-control patternvalidation dcr-reset-values nonzero decimalfixed heightFromGroundWithOutStairRoom{{bldgIdx}}"' +
            '                    maxlength="6" data-pattern="decimalvalue"' +
            '                    id="heightFromGroundWithOutStairRoomFromEdcr{{bldgIdx}}" required="required"' +
            '                    name="buildingDetailFromEdcr[{{bldgIdx}}].heightFromGroundWithOutStairRoom"' +
            '                    value="{{height}}" disabled="true"/>' +
            '        </div>' +
      /*      '        <label' +
            '                class="col-sm-2 control-label text-right heightFromGroundWithStairRoom{{bldgIdx}}">' +
            '                Height From Ground Level with stair Room (In Mtrs)</label>' +
            '        <div class="col-sm-3 add-margin">' +
            '            <input type="hidden" id="setHeightFromGroundWithStairRoom{{bldgIdx}}"' +
            '                   name="buildingDetail[{{bldgIdx}}].heightFromGroundWithStairRoom"' +
            '                   value="{{height}}">' +
            '            <input' +
            '                    class="form-control patternvalidation dcr-reset-values decimalfixed heightFromGroundWithStairRoom{{bldgIdx}}"' +
            '                    maxlength="6" data-pattern="decimalvalue"' +
            '                    id="heightFromGroundWithStairRoomFromEdcr{{bldgIdx}}"' +
            '                    name="buildingDetailFromEdcr[{{bldgIdx}}].heightFromGroundWithStairRoom"' +
            '                    value="{{height}}"/>' +
            '        </div>' +
            '    </div>' +
            '    <div class="form-group">' +
            '        <label' +
            '                class="col-sm-3 control-label text-right fromStreetLevelWithOutStairRoom{{bldgIdx}}">' +
            '                Height From Street Level without stair Room (In Mtrs)</label>' +
            '        <div class="col-sm-3 add-margin">' +
            '            <input type="hidden" id="setFromStreetLevelWithOutStairRoom{{bldgIdx}}"' +
            '                   name="buildingDetail[{{bldgIdx}}].fromStreetLevelWithOutStairRoom"' +
            '                   value="{{height}}">' +
            '            <input' +
            '                    class="form-control patternvalidation dcr-reset-values decimalfixed fromStreetLevelWithOutStairRoom{{bldgIdx}}"' +
            '                    maxlength="6" data-pattern="decimalvalue"' +
            '                    id="fromStreetLevelWithOutStairRoomFromEdcr{{bldgIdx}}"' +
            '                    name="buildingDetailFromEdcr[{{bldgIdx}}].fromStreetLevelWithOutStairRoom"' +
            '                    value="{{height}}"/>' +
            '        </div>' +
            '        <label' +
            '                class="col-sm-2 control-label text-right fromStreetLevelWithStairRoom">' +
            '                Height From Street Level with stair Room (In Mtrs)</label>' +
            '        <div class="col-sm-3 add-margin">' +
            '            <input type="hidden" id="setFromStreetLevelWithStairRoom{{bldgIdx}}"' +
            '                   name="buildingDetail[{{bldgIdx}}].fromStreetLevelWithStairRoom"' +
            '                   value="{{height}}">' +
            '            <input' +
            '                    class="form-control patternvalidation dcr-reset-values decimalfixed fromStreetLevelWithStairRoom{{bldgIdx}}"' +
            '                    maxlength="6" data-pattern="decimalvalue"' +
            '                    id="fromStreetLevelWithStairRoomFromEdcr{{bldgIdx}}"' +
            '                    name="buildingDetailFromEdcr[{{bldgIdx}}].fromStreetLevelWithStairRoom"' +
            '                    value="{{height}}"/>' +
            '        </div>' +
            '    </div>' +    */
            '    </div>';


        function addBlock(bldgIdx, name, noOfBlocks) {
            var blockTitle;
            var toggleIcon;
            if(noOfBlocks > 1) {
                blockTitle = $('#blockMsg').val()+ '- ' +name+ ' '+$('#builtupAndCarpetDetails').val();
                toggleIcon = '<div class="history-icon toggle-icon'+bldgIdx+'">'+
                    '      <i class="fa fa-angle-up fa-2x"></i></div>';
            } else {
                toggleIcon = '';
                blockTitle = $('#builtupAndCarpetDetails').val();
            }
            var header = '<div class="panel-heading custom_form_panel_heading toggle-bldg-header toggle-head'+bldgIdx+'"' +
                '                 data-bldg-idx="'+bldgIdx+'">'+'<div class="panel-title"> '+blockTitle+' </div> '+toggleIcon+' </div>'
            $table = $('<table class="table table-striped table-bordered edcrBuildingAreaDetails'+bldgIdx+'"></table>');
            $table.append(thead);
            $table.append(tbody);
            $table.append(tfoot);
            $('#blocksContainer').append(header);
            $('#blocksContainer').append($table);

        }

        function addFloorDetailsIntoTable(bldgIdx,floorIdx, sno, floorDesc, floorNo, subOccupancy,occupancy, builtupArea, floorArea, carpetArea) {
            //Add row
        	var occupancyId;
        	var occupancyDesc;
        	if(subOccupancy!=null && subOccupancy.length>0){
        		occupancyId = subOccupancy[0].id;
        		occupancyDesc = subOccupancy[0].description;
        	} else {
        		occupancyId = occupancySuboccupancyMap[occupancy[0].id][0].id;
        		occupancyDesc = occupancySuboccupancyMap[occupancy[0].id][0].description;
        	}
        		
            var rowJsonObj={
                'sno': sno+1,
                'bldgIdx': bldgIdx,
                'idx': floorIdx,
                'orderOfFloor': floorIdx+1,
                'floorDesc': floorDesc,
                'floorNo': floorNo,
                'occupancyId': occupancyId,
                'occupancyDesc': occupancyDesc,
                'plinthArea': builtupArea.toFixed(2),
                'floorArea': floorArea.toFixed(2),
                'carpetArea': carpetArea.toFixed(2)
            };
            addNewRowFromObject(rowJsonObj);
            setDCRFloorCount();
            patternvalidation();
        }

        function addNewRowFromObject(rowJsonObj) {
            $table.append(row.compose(rowJsonObj));
        }

        // Will Auto Populate proposed building details
        function setProposedBuildingDetailFromEdcrs(planDetail) {
            var blockIdx = 0;
            for(var i = 0; i < planDetail.blocks.length; i++) {
                var block = planDetail.blocks[i];
                if(block.building.totalBuitUpArea > 3000)
                    $('#infrastructureCost').attr('required',true);

                // If Proposed building details present then only will insert
                if (isProposedBuildingDetailsPresent(block)) {
                    addBlock(blockIdx, block.number, planDetail.blocks.length);
                    addBlockSubUsages(blockIdx, block);

                    setBuildingFloorDetails(block, blockIdx, '.edcrBuildingAreaDetails'+blockIdx);

                    var otherProposedBldgDtls = {
                        'bldgIdx': blockIdx,
                        'name': block.name,
                        'number': block.number,
                        'height': block.building.buildingHeight,
                        'totalPlinthArea':block.building.totalBuitUpArea,
                        'floorCount':block.building.floorsAboveGround
                    };
                    addOtherProposedBldgDtls(otherProposedBldgDtls, blockIdx, planDetail.blocks.length);
                    blockIdx++;
                }
            }

            $('.serviceType').trigger('change');
        }
     
        function getApplicationType(area, height, occupancy) {   
        	$.ajax({
				url : '/bpa/ajax/getApplicationType?height='+height+'&plotArea='+area+'&occupancy='+occupancy,
				type: "GET",
				 contentType: 'application/json; charset=utf-8',
				success: function (response) {
					if(response){
					$('#applicationTypeSec').val(response.applicationTypeSec);
	                $('#applicationType').val(response.id);
                    $('#applicationType').attr("disabled", "disabled");
                    $('#applicationType').trigger('change');

					}else{
						console.log('No applications available');
					}
					
				}, 
				error: function (response) {
					//
				}
			});

   }


        // Will Auto Populate existing building details
        function setExistingBuildingDetailFromEdcrs(planDetail) {
            var blockIdx = 0;
            for(var i = 0; i < planDetail.blocks.length; i++) {
                var block = planDetail.blocks[i];
                // If Existing building details present then only will insert
                if(isExistingBuildingDetailsPresent(block)) {
                    addExistBldgBlock(blockIdx, block.number, planDetail.blocks.length);
                    setExistingBuildingFloorDetails(block, blockIdx);
                    var otherExistBldgDtls = {
                        'bldgIdx': blockIdx,
                        'name': block.name,
                        'number': block.number,
                        'totalPlinthArea':block.building.totalExistingBuiltUpArea
                    };
                    addOtherExistBldgDtls(otherExistBldgDtls, blockIdx, planDetail.blocks.length);
                    blockIdx++;
                }
            }
        }
        
        function isExistingBuildingDetailsPresent(block) {
            var isFound = false;
            for(var i = 0; i < block.building.floors.length; i++) {
                var floorObj = block.building.floors[i];
                for(var j = 0; j < floorObj.occupancies.length; j++) {
                    var occupancy = floorObj.occupancies[j];
                    if(occupancy.existingBuiltUpArea && occupancy.existingFloorArea) {
                        isFound = true;
                        break;
                    }
                }
                if(isFound)
                    break;
            }
            return isFound;
        }

        function isProposedBuildingDetailsPresent(block) {
            var isFound = false;
            for(var i = 0; i < block.building.floors.length; i++) {
                var floorObj = block.building.floors[i];
                for(var j = 0; j < floorObj.occupancies.length; j++) {
                    var occupancy = floorObj.occupancies[j];
                    if(occupancy.builtUpArea && occupancy.builtUpArea > 0 && occupancy.floorArea && occupancy.floorArea > 0) {
                        isFound = true;
                        break;
                    }
                }
                if(isFound)
                    break;
            }
            return isFound;
        }

        function addOtherProposedBldgDtls(other, bldgIdx, blocksLen) {
            $('#blocksContainer').append(otherBldgDetails.compose(other));
            if(blocksLen > 1)
              $('.edcrBuildingAreaDetails'+bldgIdx).wrap($("<div/>").attr('class','buildingDetailsToggle'+bldgIdx+' display-hide'));
        }

        function setBuildingFloorDetails(block, blkIdx, tableId) {
            var floorIdx = 0;
            for(var i = 0; i < block.building.floors.length; i++) {
                var floorObj = block.building.floors[i];
                for(var j = 0; j < floorObj.occupancies.length; j++) {
                    var occupancy = floorObj.occupancies[j];
                    // Will auto populate floor details in proposed building
                    if(occupancy.builtUpArea && occupancy.builtUpArea > 0) {
                        addFloorDetailsIntoTable(blkIdx, floorIdx, $(tableId+" tbody tr").length, floorObj.name, floorObj.number, subOccupancyResponseByName[occupancy.typeHelper.subtype.name],occupancyResponseByName[occupancy.typeHelper.type.name],occupancy.builtUpArea, occupancy.floorArea, occupancy.carpetArea);
                        floorIdx++;
                    }
                }
            }
            validateAndCalculateSumForDCRFloorDetails(tableId, blkIdx);
        }

        function setExistingBuildingFloorDetails(block, blkIdx) {
            var floorIdx = 0;
            for(var i = 0; i < block.building.floors.length; i++) {
                var floorObj = block.building.floors[i];
                for(var j = 0; j < floorObj.occupancies.length; j++) {
                    var occupancy = floorObj.occupancies[j];
                    // Will auto populate floor details in existing building
                    if(occupancy.existingBuiltUpArea && occupancy.existingBuiltUpArea > 0) {
                        addExistBldgFloorDetailsIntoTable(blkIdx, floorIdx, $('.existingBuildingAreaDetails'+blkIdx+' tbody tr').length, floorObj.name, floorObj.number, subOccupancyResponseByName[occupancy.typeHelper.subtype.name],occupancyResponseByName[occupancy.typeHelper.type.name],occupancy.existingBuiltUpArea, occupancy.existingFloorArea, occupancy.existingCarpetArea);
                        floorIdx++;
                    }
                }
            }
            validateAndCalculateSumForDCRFloorDetails('.existingBuildingAreaDetails'+blkIdx, blkIdx);
        }

        //***********END - Auto populate proposed buildings details*********************


        //***********START - Auto populate existing buildings details*********************

        function addOtherExistBldgDtls(other, bldgIdx, blocksLen) {
            $('#existBldgBlocksContainer').append(otherExistBldgDetails.compose(other));
            if(blocksLen > 1)
                $('.existingBuildingAreaDetails'+bldgIdx).wrap($("<div/>").attr('class','buildingDetailsToggle'+bldgIdx+' display-hide'));
        }

        var $existTable;
        var existingBldgRow = '<tr>'+
            '<td class="text-center"><span class="serialNo text-center" id="slNoInsp">{{sno}}</span><input type="hidden" class="orderNo" data-sno name="existingBldgDetailFromEdcr[{{bldgIdx}}].existingBldgFloorDetailsFromEdcr[{{idx}}].orderOfFloor" value="{{orderOfFloor}}"/></td>'+
            '<td ><select name="existingBldgDetailFromEdcr[{{bldgIdx}}].existingBldgFloorDetailsFromEdcr[{{idx}}].floorDescription" data-first-option="false" class="form-control dcr-floor-details-mandatory floorDescription{{bldgIdx}} clear-details" disabled="true" maxlength="128" > <option value="{{floorDesc}}">{{floorDesc}}</option></select></td>'+
            '<td class="text-right"><input type="text" class="form-control table-input text-center patternvalidation floorNumber{{bldgIdx}} dcr-floor-details-mandatory clear-details" name="existingBldgDetailFromEdcr[{{bldgIdx}}].existingBldgFloorDetailsFromEdcr[{{idx}}].floorNumber" data-pattern="number" value="{{floorNo}}" maxlength="3" disabled="true" /></td>'+
            '<td ><select name="existingBldgDetailFromEdcr[{{bldgIdx}}].existingBldgFloorDetailsFromEdcr[{{idx}}].subOccupancy" data-first-option="false" class="form-control dcr-floor-details-mandatory{{bldgIdx}} occupancy{{bldgIdx}}" maxlength="128" disabled="true"> <option value="{{occupancyId}}">{{occupancyDesc}}</option></select></td>'+
            '<td class="text-right"><input type="text" class="form-control table-input text-right patternvalidation dcrPlinthArea{{bldgIdx}} dcr-floor-details-mandatory nonzero decimalfixed" data-pattern="decimalvalue" name="existingBldgDetailFromEdcr[{{bldgIdx}}].existingBldgFloorDetailsFromEdcr[{{idx}}].plinthArea" value="{{plinthArea}}" maxlength="10" required="required" disabled="true" /></td>'+
            '<td class="text-right"><input type="text" class="form-control table-input text-right patternvalidation dcrFloorArea{{bldgIdx}} dcr-floor-details-mandatory decimalfixed" data-pattern="decimalvalue" name="existingBldgDetailFromEdcr[{{bldgIdx}}].existingBldgFloorDetailsFromEdcr[{{idx}}].floorArea" value="{{floorArea}}" maxlength="10" required="required" disabled="true" /></td>'+
            '<td class="text-right"><input type="text" class="form-control table-input text-right patternvalidation dcrCarpetArea{{bldgIdx}} dcr-floor-details-mandatory decimalfixed" data-pattern="decimalvalue" name="existingBldgDetailFromEdcr[{{bldgIdx}}].existingBldgFloorDetailsFromEdcr[{{idx}}].carpetArea" value="{{carpetArea}}" maxlength="10" required="required" disabled="true" /></td>'+
        '</tr>';

        function addExistBldgBlock(bldgIdx, name, noOfBlocks) {
            var blockTitle;
            var toggleIcon;
            if(noOfBlocks > 1) {
                blockTitle =  $('#blockMsg').val()+'- '+name+ ' ' + $('#builtupAndCarpetDetails').val();
                toggleIcon = '<div class="history-icon toggle-icon'+bldgIdx+'">'+
                    '      <i class="fa fa-angle-up fa-2x"></i></div>';
            } else {
                toggleIcon = '';
                blockTitle = $('#builtupAndCarpetDetails').val();
            }
            var header = '<div class="panel-heading custom_form_panel_heading toggle-bldg-header toggle-head'+bldgIdx+'"' +
                '                 data-bldg-idx="'+bldgIdx+'">'+'<div class="panel-title"> '+blockTitle+' </div> '+toggleIcon+' </div>'
            $existTable = $('<table class="table table-striped table-bordered existingBuildingAreaDetails'+bldgIdx+'"></table>');
            $existTable.append(thead);
            $existTable.append(tbody);
            $existTable.append(tfoot);
            $('#existBldgBlocksContainer').append(header);
            $('#existBldgBlocksContainer').append($existTable);

        }

        var otherExistBldgDetails = '<div class="existingBuildingAreaDetails{{bldgIdx}}">' +
            '            <input type="hidden" id="name" name="existingBldgDetailFromEdcr[{{bldgIdx}}].name"' +
            '                   value="{{name}}">' +
            '            <input type="hidden" id="number" name="existingBldgDetailFromEdcr[{{bldgIdx}}].number"' +
            '                   value="{{number}}">' +
            '            <input type="hidden" id="setTotalPlintArea{{bldgIdx}}" name="existingBldgDetailFromEdcr[{{bldgIdx}}].totalPlintArea"' +
            '                   value="{{totalPlinthArea}}">' +
            '    </div>';

        function addExistBldgFloorDetailsIntoTable(bldgIdx,floorIdx, sno, floorDesc, floorNo, subOccupancy,occupancy, builtupArea, floorArea, carpetArea) {
            //Add row
        	var occupancyId;
        	var occupancyDesc;
        	if(subOccupancy!=null && subOccupancy.length>0){
        		occupancyId = subOccupancy[0].id;
        		occupancyDesc = subOccupancy[0].description;
        	} else {
        		occupancyId = occupancySuboccupancyMap[occupancy[0].id][0].id;
        		occupancyDesc = occupancySuboccupancyMap[occupancy[0].id][0].description;
        	}
            var rowJsonObj={
                'sno': sno+1,
                'bldgIdx': bldgIdx,
                'idx': floorIdx,
                'orderOfFloor': floorIdx+1,
                'floorDesc': floorDesc,
                'floorNo': floorNo,
                'occupancyId': occupancyId,
                'occupancyDesc': occupancyDesc,
                'plinthArea': builtupArea,
                'floorArea': floorArea,
                'carpetArea': carpetArea
            };
            addNewRowFromObject1(rowJsonObj);
            setDCRFloorCount();
            patternvalidation();
        }

        function addNewRowFromObject1(rowJsonObj) {
            $existTable.append(existingBldgRow.compose(rowJsonObj));
        }

        //***********END - Auto populate existing buildings details*********************

        var occupancySubUsage = '<div class="col-sm-1"></div><div><input type="hidden" name="buildingSubUsages[{{blkIdx}}].application""><input type="hidden" name="buildingSubUsages[{{blkIdx}}].subUsageDetails[{{subUsageIdx}}].mainUsage" value="{{mainUsageId}}">' +
            '<input type="hidden" name="buildingSubUsages[{{blkIdx}}].blockNumber" value="{{blockNumber}}"><input type="hidden" name="buildingSubUsages[{{blkIdx}}].blockName" value="{{blockName}}"> <div class="form-group col-sm-3">' +
            '<label for="name" class="col-md-12 view-content">{{mainUsage}}<span class="mandatory"></span></label>'+
        '<div>'+
        '<select name="buildingSubUsages[{{blkIdx}}].subUsageDetails[{{subUsageIdx}}].subUsages" multiple id="{{mainUsage}}"'+
        'class="form-control tick-indicator" required="required">'+
        '</select> </div> </div>';

        function addBlockSubUsages(idx, block) {
            if (block.building.totalArea.length > 0) {
                var occupancyIdx=0;
                for (var i = 0; i < block.building.totalArea.length; i++) {
                    var occupancy = block.building.totalArea[i];
                    if(occupancy.builtUpArea && occupancy.builtUpArea > 0) {
                        $.ajax({
                            async: false,
                            crossDomain: true,
                            type: "GET",
                            url: '/bpa/occupancy/sub-usages/',
                            data: {
                                occupancy: occupancy.typeHelper.type.name
                            },
                            contentType: 'application/json; charset=utf-8',
                            success: function (response) {
                                addSubUsages(idx, occupancyIdx, response, block.name, block.number, response[0].subOccupancy.occupancy.description, response[0].subOccupancy.occupancy.id);
                            }
                        });
                        occupancyIdx++;
                    }
                }
            }
        }

        function loadSubUsages(subUsages, selectBoxName) {
            $.each(subUsages, function(index, subUsage) {
                $('select[name="'+selectBoxName+'"]').append($('<option title="'+subUsage.description+'">').val(subUsage.id).text(subUsage.description));
            });
        }
        function addSubUsages(blkIdx, subUsageIdx, subUsages, blockName, blockNo, mainUsageDesc, mainUsageId) {

            //Add row
             var rowJsonObj={
                 'sno': i+1,
                 'blkIdx': blkIdx,
                 'subUsageIdx': subUsageIdx,
                 'mainUsage': mainUsageDesc,
                 'mainUsageId': parseInt(mainUsageId),
                 'blockNumber': blockNo,
                 'blockName': blockName
             };
             if(blockNo === '1') {
                 $('#block1-desc').html('Block - '+ blockNo);
                 $('#block1').append(occupancySubUsage.compose(rowJsonObj));
             } else if(blockNo === '2') {
                 $('#block2-desc').html('Block - '+ blockNo);
                 $('#block2').append(occupancySubUsage.compose(rowJsonObj));
             } else if(blockNo === '3') {
                 $('#block3-desc').html('Block - '+ blockNo);
                 $('#block3').append(occupancySubUsage.compose(rowJsonObj));
             } else if(blockNo === '4') {
                 $('#block4-desc').html('Block - '+ blockNo)
                 $('#block4').append(occupancySubUsage.compose(rowJsonObj));
             } else if(blockNo === '5') {
                 $('#block5-desc').html('Block - '+ blockNo)
                 $('#block5').append(occupancySubUsage.compose(rowJsonObj));
             } else if(blockNo === '6') {
                 $('#block6-desc').html('Block - '+ blockNo)
                 $('#block6').append(occupancySubUsage.compose(rowJsonObj));
             } else if(blockNo === '7') {
                 $('#block7-desc').html('Block - '+ blockNo)
                 $('#block7').append(occupancySubUsage.compose(rowJsonObj));
             } else if(blockNo === '8') {
                 $('#block8-desc').html('Block - '+ blockNo)
                 $('#block8').append(occupancySubUsage.compose(rowJsonObj));
             } else if(blockNo === '9') {
                 $('#block9-desc').html('Block - '+ blockNo)
                 $('#block9').append(occupancySubUsage.compose(rowJsonObj));
             } else if(blockNo === '10') {
                 $('#block10-desc').html('Block - '+ blockNo)
                 $('#block10').append(occupancySubUsage.compose(rowJsonObj));
             }

             loadSubUsages(subUsages, "buildingSubUsages["+blkIdx+"].subUsageDetails["+subUsageIdx+"].subUsages");
           // $("select.tick-indicator").trigger('mousedown');
             patternvalidation();
        }


            if ($('#eDcrNumber').val()) {
                getEdcrApprovedPlanDetails();
            }

            $('#eDcrNumber').blur(function () {
                if ($('#eDcrNumber').val()) {
                    if (!checkEdcrExpiry()){
                    	if(!checkIsEdcrNumberUsedInAnyBpaApplication())
                    	getEdcrApprovedPlanDetails();
                      }
                } else {
                    resetDCRPopulatedValues();
                }

            });

            function getEdcrApprovedPlanDetails() {
                $.ajax({
                    async: false,
                    crossDomain: true,
                    url: '/edcr/public/approved-plan-details/by-edcr-number/' + $('#eDcrNumber').val(),
                    type: "GET",
                    contentType: 'application/json; charset=utf-8',
                    success: function (response) {
                    	
                    	if (response.errorDetail && response.errorDetail.errorCode != null && response.errorDetail.errorCode != '') {
                            bootbox.alert(response.errorDetail.errorMessage);
                            $('#eDcrNumber').val('');
                            resetDCRPopulatedValues();
                        } else if(response.applicationType !== 'Permit') {
                            bootbox.alert($('#dcrforoc').val());
                    	} else if ($("#serviceType option:selected").text()&& response.serviceType && response.serviceType !== $("#serviceType option:selected").text()) {
                            bootbox.alert($('#buildScrutinyNumber').val() + response.serviceType + $('#buildingPlanApplnForServiceType').val() + $("#serviceType option:selected").text() + $('#buildServiceType').val());
                            $('#eDcrNumber').val('');
                            resetDCRPopulatedValues();
                        } else {
                            if ($('#loadingFloorDetailsFromEdcrRequire').val() === 'true' && $('#mode').val() && $('#mode').val() === 'new')
                                resetDCRPopulatedValues();
                            $('#edcrApplicationNumber').html(response.applicationNumber);
                            $('#edcrUploadedDate').html(response.applicationDate);
                            $('#edcrDxfFile').html('<a href="/egi/downloadfile?fileStoreId=' + response.dxfFile.fileStoreId + '&moduleName=Digit DCR&toSave=true">' + response.dxfFile.fileName + '</a>');
                            $('#edcrPlanReportOutput').html('<a href="/egi/downloadfile?fileStoreId=' + response.reportOutput.fileStoreId + '&moduleName=Digit DCR&toSave=true">' + response.reportOutput.fileName + '</a>');
                            updateNocRequired(response.plan.planInformation);
                            if ($('#loadingFloorDetailsFromEdcrRequire').val() === 'true' && $('#mode').val() && $('#mode').val() === 'new' && response.plan) {
                                var existingBldgPresent = [];
                                if (response.plan.blocks.length > 0)
                                    for (var i = 0; i < response.plan.blocks.length; i++) {
                                        var block = response.plan.blocks[i];
                                        existingBldgPresent.push(isExistingBuildingDetailsPresent(block));
                                    }
                                if (response.plan.blocks.length <= 0) {
                                    // Validate proposed building details if not present
                                    bootbox.alert($('#forBuildScrutinyNumber').val() + $('#eDcrNumber').val() + " " + $('#floorDetailsNotExtracted').val());
                                    $('#eDcrNumber').val('');
                                    resetDCRPopulatedValues();
                                    return false;
                                } else if (response.plan.blocks.length > 0 && existingBldgPresent.length > 0
                                    && ($("#serviceType option:selected").text() === 'Alteration'
                                        || $("#serviceType option:selected").text() === 'Addition or Extension')
                                    && jQuery.inArray(true, existingBldgPresent) === -1) {
                                    // Validate existing building details if not present for required service
                                    bootbox.alert($('#forBuildScrutinyNumber').val() + $('#eDcrNumber').val() + " "  + $('#existingBuildDetailsNotPresent').val());
                                    $('#eDcrNumber').val('');
                                    resetDCRPopulatedValues();
                                    return false;
                                } else {
                                	//Reset selected occupancies 
                                	$('#occupancyapplnlevel').val('');
                                	if (response.plan.occupancies.length > 0) {
                                		var occupancies = [];
	                                    $.each(response.plan.occupancies, function(index, occupancy) {
	                                        if(response.plan.planInformation.roadWidth < 12 && occupancy.type == 'Industrial')
                                               bootbox.alert('Road width cannot be less than 12m for industrial occupancy');
	                                    	occupancies.push(occupancy.typeHelper.type.name);
	                                    });
	                                    
	                                    $('[name=permitOccupanciesTemp] option').filter(function () {
	                                        return occupancies.indexOf($(this).text()) > -1; //Options text exists in array
	                                      }).prop('selected', true);
                                	}
                                    $('#occupancyapplnlevel').trigger('change');
                                    $('#occupancyapplnlevel').attr("readonly", "true");

                                    if(existingBldgPresent.length > 0 && jQuery.inArray(true, existingBldgPresent) !== -1) {
                                     	$('.existingbuildingdetails').show();
                                    	setExistingBuildingDetailFromEdcrs(response.plan);                                        
                                     } else {
                                     	$('.existingbuildingdetails').hide();
                                     }
                                    
                                    setProposedBuildingDetailFromEdcrs(response.plan);
                                    
                                    //Get application type and set to application
                                    var occupancy = "";
                                	if (response.plan.occupancies.length == 1) {
                                		occupancy = response.plan.occupancies[0].typeHelper.type.name;    
                                	} else {
                                		if(response.plan.virtualBuilding)
                                			occupancy=response.plan.virtualBuilding.mostRestrictiveFarHelper.type.name;
                                	}
                                    var area =response.plotArea.toFixed(2);
                                    getApplicationType(area, response.plan.blocks[0].building.buildingHeight,occupancy);

                                    if($('#dcrDocsAutoPopulate').val() === 'true' || $('#dcrDocsAutoPopulateAndManuallyUpload').val() === 'true')
                                        autoPopulatePlanScrutinyGeneratedPdfFiles(response.planScrutinyPdfs);

                                    if (response.planFileStore === null)
                                        $('.editable').removeAttr("disabled");
                                    else
                                        $('.editable').attr("disabled", "disabled");
                                }

                                if (response.plan.planInformation.demolitionArea >= 0) {
                                    $('.demolitionDetails').show();
                                    $('#demolitionArea').val(response.plan.planInformation.demolitionArea);
                                    $('#demolitionArea').attr('readOnly', true);
                                }
                                if (response.projectType) {
                                    $('#projectName').val(response.projectType);
                                    $('#projectName').attr('readOnly', true);
                                } else {
                                    $('#projectName').val('');
                                    $('#projectName').removeAttr('readOnly');
                                }
                            } else if(!response.plan) {
                                console.log("Error occurred when de-serialize, please check!!!!!!!");
                            }
                            if(response.plotArea) {
                                $('#extentOfLand').val(response.plotArea.toFixed(2));
                                setExtentOfLand();
                            }
                            
                        }
                    },
                    error: function (response) {
                        console.log("Error occurred, when getting approved building plan scrutiny details!!!!!!!");
                    }
                });
            }
        //to update noc document is required
        function updateNocRequired(planInformation){
        	if(planInformation.nocIrrigationDept === 'YES'){
        		$('#APPROVED_IDA_NOC').attr('disabled',true);
            	$('#REJECTED_IDA_NOC').attr('disabled',true);
                $('span.mandatory._IDA_NOC').show();
                if($('button.btn_IDA_NOC').length==1){
                	if($('#nocStatusUpdated').val() == "false" && $('#citizenOrBusinessUser').val() == "false" && (($('#isPermitApplFeeReq').val() =="NO" && $('#applicationNo').val()!="")||
                			($('#isPermitApplFeeReq').val() =="YES" && $('#permitApplFeeCollected').val()=="YES"))){
	                	$('th.thbtn').show();
	                    $('td.tdbtn').show();
                	}else{
                		$('th.thbtn').hide();
	                    $('td.tdbtn').hide();
                	}
                }else if($('input.hidden_IDA_NOC').val() != 'initiated' && $('input.autohidden_IDA_NOC').val() != 'autoinitiate' && $('input.apphidden_IDA_NOC').val() != 'initiated' ){
                	$('div._IDA_NOC').attr('required','required');
                	$('div.divfv_IDA_NOC').show();
                }
                
                if($('input.hidden_IDA_NOC').val() == 'initiate' || $('input.autohidden_IDA_NOC').val() == 'autoinitiate'){
                    $('span.mandatory._IDA_NOC').hide();
                }
                
            
                if($('#nocAppl').length > 0)
                {
                	$('th.thstatus').show();
                    $('td.tdstatus').show();    
                    $('th.thsla').show();
                    $('td.tdsla').show(); 
                    $('th.thda').show();
                    $('td.tdda').show(); 
                }
        	}
        	if(planInformation.nocNearMonument === 'YES'){
        		$('#APPROVED_NMA_NOC').attr('disabled',true);
            	$('#REJECTED_NMA_NOC').attr('disabled',true);
                $('span.mandatory._NMA_NOC').show();
                if($('button.btn_NMA_NOC').length==1){
                	if($('#nocStatusUpdated').val() == "false" &&  $('#citizenOrBusinessUser').val() == "false" && (($('#isPermitApplFeeReq').val() =="NO" && $('#applicationNo').val()!="")||
                			($('#isPermitApplFeeReq').val() =="YES" && $('#permitApplFeeCollected').val()=="YES"))){
	                	$('th.thbtn').show();
	                    $('td.tdbtn').show();
                	}else{
                		$('th.thbtn').hide();
	                    $('td.tdbtn').hide();
                	}
                }else if($('input.hidden_NMA_NOC').val() != 'initiate' && $('input.autohidden_NMA_NOC').val() != 'autoinitiate' && $('input.apphidden_NMA_NOC').val() != 'initiated' ){
                	$('div._NMA_NOC').attr('required','required');
                	$('div.divfv_NMA_NOC').show();
                }
                
                if($('input.hidden_NMA_NOC').val() == 'initiate' || $('input.autohidden_NMA_NOC').val() == 'autoinitiate'){
                    $('span.mandatory._NMA_NOC').hide();
                }
                
                if($('#nocAppl').length > 0)
                {
                	$('th.thstatus').show();
                    $('td.tdstatus').show(); 
                    $('th.thsla').show();
                    $('td.tdsla').show(); 
                    $('th.thda').show();
                    $('td.tdda').show(); 
                }
        	}
        	
        	if(planInformation.nocStateEnvImpact === 'YES'){
            	$('#APPROVED_MOEF_NOC').attr('disabled',true);
            	$('#REJECTED_MOEF_NOC').attr('disabled',true);
            	$('span.mandatory._MOEF_NOC').show();
            	if($('button.btn_MOEF_NOC').length==1){
                	if($('#nocStatusUpdated').val() == "false" && $('#citizenOrBusinessUser').val() == "false" && (($('#isPermitApplFeeReq').val() =="NO" && $('#applicationNo').val()!="")||
                			($('#isPermitApplFeeReq').val() =="YES" && $('#permitApplFeeCollected').val()=="YES"))){
	                	$('th.thbtn').show();
	                    $('td.tdbtn').show();
                	}else{
                		$('th.thbtn').hide();
	                    $('td.tdbtn').hide();
                	}
                }else if($('input.hidden_MOEF_NOC').val() != 'initiate' && $('input.autohidden_MOEF_NOC').val() != 'autoinitiate' && $('input.apphidden_IDA_NOC').val() != 'initiated' ){
                	$('div._MOEF_NOC').attr('required','required');
                	$('div.divfv_MOEF_NOC').show();
                }
            	
            	 if($('input.hidden_MOEF_NOC').val() == 'initiate' || $('input.autohidden_MOEF_NOC').val() == 'autoinitiate'){
                     $('span.mandatory._MOEF_NOC').hide();
                 }
            	
            
            	if($('#nocAppl').length > 0)
                {
                	$('th.thstatus').show();
                    $('td.tdstatus').show(); 
                    $('th.thsla').show();
                    $('td.tdsla').show();
                    $('th.thda').show();
                    $('td.tdda').show(); 
                }
            }
        	
            if(planInformation.nocNearAirport === 'YES'){
            	$('#APPROVED_AAI_NOC').attr('disabled',true);
            	$('#REJECTED_AAI_NOC').attr('disabled',true);
                $('span.mandatory._AAI_NOC').show();
                if($('button.btn_AAI_NOC').length==1){
                	if($('#nocStatusUpdated').val() == "false" && $('#citizenOrBusinessUser').val() == "false" && (($('#isPermitApplFeeReq').val() =="NO" && $('#applicationNo').val()!="")||
                			($('#isPermitApplFeeReq').val() =="YES" && $('#permitApplFeeCollected').val()=="YES"))){
	                	$('th.thbtn').show();
	                    $('td.tdbtn').show();
                	}else{
                		$('th.thbtn').hide();
	                    $('td.tdbtn').hide();
                	}
                }else if($('input.hidden_AAI_NOC').val() != 'initiate' && $('input.autohidden_AAI_NOC').val() != 'autoinitiate' && $('input.apphidden_AAI_NOC').val() != 'initiated' ){
                	$('div._AAI_NOC').attr('required','required');
                	$('div.divfv_AAI_NOC').show();
                }
                
                if($('input.hidden_AAI_NOC').val() == 'initiate' || $('input.autohidden_AAI_NOC').val() == 'autoinitiate'){
                    $('span.mandatory _AAI_NOC').hide();
                }
                
                if($('#nocAppl').length > 0)
                {
                	$('th.thstatus').show();
                    $('td.tdstatus').show();
                    $('th.thsla').show();
                    $('td.tdsla').show(); 
                    $('th.thda').show();
                    $('td.tdda').show(); 
                }
            }
            if(planInformation.nocFireDept === 'YES'){
            	$('#APPROVED_FIRE_NOC').attr('disabled',true);
            	$('#REJECTED_FIRE_NOC').attr('disabled',true);

                $('span.mandatory._FIRE_NOC').show();
                if($('button.btn_FIRE_NOC').length==1){
                	if($('#nocStatusUpdated').val() == "false" && $('#citizenOrBusinessUser').val() == "false" && (($('#isPermitApplFeeReq').val() =="NO" && $('#applicationNo').val()!="")||
                			($('#isPermitApplFeeReq').val() =="YES" && $('#permitApplFeeCollected').val()=="YES"))){
	                	$('th.thbtn').show();
	                    $('td.tdbtn').show();
                	}else{
                		$('th.thbtn').hide();
	                    $('td.tdbtn').hide();
                	}
                }else if($('input.hidden_FIRE_NOC').val() != 'initiate' && $('input.autohidden_FIRE_NOC').val() != 'autoinitiate' && $('input.apphidden_FIRE_NOC').val() != 'initiated'){
                	$('div._FIRE_NOC').attr('required','required');
                	$('div.divfv_FIRE_NOC').show();
                }
                
                if($('input.hidden_FIRE_NOC').val() == 'initiate' || $('input.autohidden_FIRE_NOC').val() == 'autoinitiate'){
                    $('span.mandatory._FIRE_NOC').hide();
                }
                if($('#nocAppl').length > 0)
                {
                	$('th.thstatus').show();
                    $('td.tdstatus').show();  
                    $('th.thsla').show();
                    $('td.tdsla').show(); 
                    $('th.thda').show();
                    $('td.tdda').show(); 
                }
            }
        }
        // Auto populate system generated plan scrutiny checklist documents
        function autoPopulatePlanScrutinyGeneratedPdfFiles(planScrutinyPdfs) {
            if(Object.keys(planScrutinyPdfs).length > 0) {
                for (var checklist in planScrutinyPdfs) {
                    var filestoreIds = [];
                    $.each(planScrutinyPdfs[checklist], function(index, file) {
                        if($('#dcrDocsAutoPopulateAndManuallyUpload').val() === 'true') {
                            var $addFileBtn = $('.'+checklist).children('.file-add');
                            var $fileViewer = '<div class="file-viewer" data-toggle="tooltip" data-placement="top" title="' +file.fileName+ '"><a class="download" href="/egi/downloadfile?fileStoreId=' + file.fileStoreId + '&moduleName=Digit DCR&toSave=true"></a><i class="fa fa-file-pdf-o" aria-hidden="true"></i><a class="deleteDcrDoc" data-id="'+ file.fileStoreId + '" href="javascript:void(0);"></a><span class="doc-numbering"></span></div>';
                            $addFileBtn.before($fileViewer);
                        } else if($('#dcrDocsAutoPopulate').val() === 'true') {
                            var $fileViewerWODelete = '<div class="file-viewer" data-toggle="tooltip" data-placement="top" title="' +file.fileName+ '"><a class="download" href="/egi/downloadfile?fileStoreId=' + file.fileStoreId + '&moduleName=Digit DCR&toSave=true"></a><i class="fa fa-file-pdf-o" aria-hidden="true"></i><span class="doc-numbering"></span></div>';
                            $('.'+checklist).append($fileViewerWODelete);
                        }
                        filestoreIds.push(file.fileStoreId);
                        addDocumentNumbering();
                    });
                    $('.'+checklist+'_fileStoreIds').val(filestoreIds);
                }
            }
        }

        //delete event - Will delete auto populated files
        $(document).on('click','.file-viewer a.deleteDcrDoc',function(){
            if($(this).data('id')){
                var id=$(this).data('id');
                var allFileIds=$(this).parent().parent().find($('.dcrFileStoreIds')).val();
                var allIds=[];
                //Split filestoreid's with comma and store in array variable
                if(allFileIds)
                    allIds=allFileIds.split(',');
                //Remove selected file from Array of files
                if ($.inArray(id, allIds) > -1)
                    allIds.splice($.inArray(id, allIds), 1);
                //After deleting selected file and set remaining files to hidden variable
                $(this).parent().parent().find($('.dcrFileStoreIds')).val(allIds.join());
            }
            $(this).closest('.files-upload-container').find('.file-add').show();
            removeTooltip($(this).parent());
            $(this).parent().remove();
            addDocumentNumbering();
        });

            function resetDCRPopulatedValues() {
                $('#edcrApplicationNumber').html('');
                $('#edcrUploadedDate').html('');
                $('#edcrDxfFile').html('');
                $('#edcrPlanReportOutput').html('');
                $('#extentOfLand').val('');
                setExtentOfLand();
                $('#blocksContainer').children().remove();
                $('#existBldgBlocksContainer').children().remove();
                for(var i=1;i<=10;i++) {
                    $('#block'+i+'-desc').html('');
                    $('#block'+i).html('');
                }
                /*$("#edcrBuildingAreaDetails tbody tr").each(function() {
                    $(this).closest('tr').remove();
                    $("#edcrBuildingAreaDetails tfoot tr td:eq(4)").html('');
                    $("#edcrBuildingAreaDetails tfoot tr td:eq(5)").html('');
                    $("#edcrBuildingAreaDetails tfoot tr td:eq(6)").html('');
                });
                $('.dcr-reset-values').val('');*/
            }

            function setExtentOfLand() {
                var extentOfLand = $('#extentOfLand').val();
                if (extentOfLand) {
                    $("#extentinsqmts").val(convertExtendOfLandToSqmts(extentOfLand, $("#unitOfMeasurement").val()));
                    $("#extentinsqmtshdn").val(convertExtendOfLandToSqmts(extentOfLand, $("#unitOfMeasurement").val()));
                }
            }
    });

        // This code require when edit facility enabled for auto populated floor details
        $(document).on('change', '.dcrPlinthArea0', function() {
            var totalPlinth = 0;
            $("#edcrBuildingAreaDetails0 tbody tr").each(function () {
                if($(this).find('td:eq(4) input.dcrPlinthArea').val())
                    totalPlinth +=  parseFloat($(this).find('td:eq(4) input.dcrPlinthArea').val());
            });
            $("#edcrBuildingAreaDetails0 tfoot tr td:eq(4)").html(totalPlinth.toFixed(2));

            validateAndCalculateSumForDCRFloorDetails('.edcrBuildingAreaDetails0', 0);
        });

        $(document).on('change', '.dcrFloorArea0', function() {
            var totalFloorArea = 0 ;
            var rowObj = $(this).closest('tr');
            $("#edcrBuildingAreaDetails0 tbody tr").each(function () {
                var rowPlinthArea = parseFloat($(this).find('td:eq(4) input.dcrPlinthArea').val());
                var rowFloorArea = parseFloat($(this).find('td:eq(5) input.dcrFloorArea').val());
                if(rowFloorArea > rowPlinthArea) {
                    $(rowObj).find('.dcrFloorArea0').val('');
                    validateAndCalculateSumForDCRFloorDetails('.edcrBuildingAreaDetails0', 0);
                    bootbox.alert($('#floorareaValidate').val());
                    return false;
                }

                if(rowFloorArea)
                    totalFloorArea +=  parseFloat(rowFloorArea);
            });
            $("#edcrBuildingAreaDetails0 tfoot tr td:eq(5)").html(totalFloorArea.toFixed(2));
            $("#sumOfFloorAreaFromEdcr").val(totalFloorArea.toFixed(2));

            validateAndCalculateSumForDCRFloorDetails('.edcrBuildingAreaDetails0', 0);
        });

        $(document).on('change', '.dcrCarpetArea0', function() {
            var rowObj = $(this).closest('tr');
            var totalCarpet = 0;
            $("#edcrBuildingAreaDetails0 tbody tr").each(function () {
                var rowFloorArea = parseFloat($(this).find('td:eq(5) input.dcrFloorArea').val());
                var rowCarpetArea = parseFloat($(this).find('td:eq(6) input.dcrCarpetArea').val());
                if($(this).find('td:eq(6) input.dcrCarpetArea').val() == '.')
                    $(this).find('td:eq(6) input.dcrCarpetArea').val(0.0);
                if(rowCarpetArea > rowFloorArea) {
                    $(rowObj).find('.dcrCarpetArea0').val('');
                    validateAndCalculateSumForDCRFloorDetails('.edcrBuildingAreaDetails0', 0);
                    bootbox.alert($("#carpetareaValidate").val());
                    return false;
                }
                if(rowCarpetArea)
                    totalCarpet += parseFloat(rowCarpetArea);
            });
            $("#edcrBuildingAreaDetails0 tfoot tr td:eq(6)").html(totalCarpet.toFixed(2));

            validateAndCalculateSumForDCRFloorDetails('.edcrBuildingAreaDetails0', 0);
        });




//Floor wise floor area validations
function validateDCRFloorDetails(plinthArea) {
    var occpancyObj = getOccupancyObject();
    var rowObj = $('#buildingAreaDetails tbody tr');
    if(occpancyObj && $("#occupancyapplnlevel option:selected" ).text() != 'Mixed') {
        var inputPlinthArea = parseFloat($(plinthArea).val()).toFixed(2);
        var permissibleAreaInPercentage = occpancyObj[0].permissibleAreaInPercentage;
        var permissibleAreaForFloor = parseFloat(extentInSqmts * permissibleAreaInPercentage / 100).toFixed(2);
        if(parseFloat(inputPlinthArea) > parseFloat(permissibleAreaForFloor)){
            $(plinthArea).val('');
            bootbox.alert($('#typeOfMsg').val() +occpancyObj[0].description+$('#permissibleAreaForFloor1').val()+permissibleAreaForFloor+$('#permissibleAreaForFloor2').val());
            validateAndCalculateSumForDCRFloorDetails('.edcrBuildingAreaDetails0', 0);
            $(rowObj).find('.dcrPlinthArea0').focus();
            return false;
        }
        validateAndCalculateSumForDCRFloorDetails('.edcrBuildingAreaDetails0', 0);
    }
}

// Calculate sum for floor areas for proposed and existing buildings
function validateAndCalculateSumForDCRFloorDetails(tableId, bldgIdx) {
    var totalPlinth = 0;
    var totalFloorArea = 0;
    var totalCarpet = 0;
    $(tableId+" tbody tr").each(function () {
        var rowPlinthArea = parseFloat($(this).find('td:eq(4) input.dcrPlinthArea'+bldgIdx).val());
        if(rowPlinthArea)
            totalPlinth +=  parseFloat(rowPlinthArea);
        $(this).closest('table').find('tfoot tr td:eq(4)').html(totalPlinth ? totalPlinth.toFixed(2) : 0);
        $("#totalPlintAreaFromEdcr"+bldgIdx).val(totalPlinth.toFixed(2));
        if(!rowPlinthArea) {
            $(this).closest('tr').find('.dcrFloorArea0').val('');
            $(this).closest('tr').find('.dcrCarpetArea0').val('');
        }
        var rowFloorArea = parseFloat($(this).find('td:eq(5) input.dcrFloorArea'+bldgIdx).val());
        if(rowFloorArea > rowPlinthArea) {
            $(this).closest('tr').find('.dcrFloorArea0').val('');
            $(this).closest('tr').find('.dcrCarpetArea0').val('');
            validateAndCalculateSumForDCRFloorDetails();
            bootbox.alert($('#floorareaValidate').val());
            return false;
        }
        if(rowFloorArea)
            totalFloorArea +=  parseFloat(rowFloorArea);
        $("#sumOfFloorAreaFromEdcr"+bldgIdx).val(totalFloorArea ? totalFloorArea.toFixed(2) : 0);
        $(this).closest('table').find('tfoot tr td:eq(5)').html(totalFloorArea.toFixed(2));

        var rowCarpetArea = parseFloat($(this).find('td:eq(6) input.dcrCarpetArea'+bldgIdx).val());
        if($(this).find('td:eq(6) input.dcrCarpetArea0').val() == '.')
            $(this).find('td:eq(6) input.dcrCarpetArea0').val(0.0);
        if(rowCarpetArea > rowFloorArea) {
            $(this).closest('tr').find('.dcrCarpetArea0').val('');
            validateAndCalculateSumForDCRFloorDetails();
            bootbox.alert($('#carpetareaValidate').val());
            return false;
        }
        if(rowCarpetArea)
            totalCarpet += parseFloat(rowCarpetArea);
        $(this).closest('table').find('tfoot tr td:eq(6)').html(totalCarpet ? totalCarpet.toFixed(2) : 0);
    });
}

function setDCRFloorCount() {

    var floorsObj={};

    $('.edcrBuildingAreaDetails tbody tr').each(function(e) {
        var floorDesc=$(this).find('.floorDescription').val().trim();
        var floorNo = $(this).find('.floorNumber').val();

        if(!floorDesc || !floorNo)
            return;
        else if(floorDesc == 'Cellar Floor')
            return;

        var floorNos= floorsObj[floorDesc] || [];
        var index = floorNos.indexOf(floorNo);

        if(floorNos.length > 0 && index ==-1){
            floorNos.push(floorNo);
        }
        else if(index == -1){
            floorNos.push(floorNo);
            floorsObj[floorDesc]=floorNos;
        }
    });

    var len=0;

    for(var key in floorsObj){
        len += floorsObj[key].length;
    }

    $("#floorCountFromEdcr").val(len);
}

function checkIsEdcrNumberUsedInAnyBpaApplication() {
    var isExist = false;
    $.ajax({
        async: false,
        url: '/bpa/validate/edcr-usedinbpa',
        type: "GET",
        data : {
            eDcrNumber : $('#eDcrNumber').val()
        },
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
            if(response.isExists == 'true' && $('#applicationNumber').val() != response.applnNoUsedEdcr) {
                bootbox.alert(response.message);
                $('#eDcrNumber').val('');
                isExist = true;
            } else {
                isExist = false;
            }
        },
        error: function (response) {
            console.log("Error occurred, when validating is dcr used in bpa application!!!!!!!");
        }
    });
    return isExist;
}

function checkEdcrExpiry() {
    var isExpired = false;
    $.ajax({
        async: false,
        url: '/bpa/validate/edcr-expiry',
        type: "GET",
        data : {
            eDcrNumber : $('#eDcrNumber').val()
        },
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
            if(response.isExpired == 'true') {
                bootbox.alert(response.message);
                $('#eDcrNumber').val('');
                isExpired = true;
            } else {
            	isExpired = false;
            }
        },
        error: function (response) {
            console.log("Error occurred, when validating dcr expiry!!!!!!!");
        }
    });
    return isExpired;
}