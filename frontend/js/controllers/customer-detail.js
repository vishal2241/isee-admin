myApp.controller('CustomerDetailCtrl', function ($scope, TemplateService, NavigationService, $timeout) {
    $scope.template = TemplateService.getHTML("content/customer-detail.html");
    TemplateService.title = "Customer Detail"; //This is the Title of the Website
    TemplateService.class = ""; //This is the Class of Page
    $scope.navigation = NavigationService.getNavigation();
    $scope.submitForm = function (formLoginData) {
        console.log("This is it");
        return new Promise(function (callback) {
            $timeout(function () {
                callback();
            }, 5000);
        });
    };

    $scope.tabs = [
        // {
        //     title: 'User',
        //     // disabled: true
        // },
        {
            title: 'Customer Note',
            // disabled: true
        },
        {
            title: 'CRM',
            // disabled: true
        },
        {
            title: 'Company',
            // disabled: true
        },
        {
            title: 'Company Contact',
            // disabled: true
        },
        {
            title: 'Company Info',
            // disabled: true
        },
        {
            title: 'Item',
            // disabled: true
        },
        {
            title: 'Location',
            // disabled: true
        },
        {
            title: 'Transaction',
            // disabled: true
        },
        {
            title: 'Warranty Item',
            // disabled: true
        }

    ];

    $scope.openLogs = function (logData) {
        console.log(logData);
        logData.isOpen = !logData.isOpen;
    };

    $scope.activeJustified = 1
    if ($scope.activeJustified == 1) {
        $scope.getExcelFields = function (formdata) {
            console.log("formdata", formdata);
            NavigationService.apiCall("ExcelUpload/customerNoteUpload", formdata, function (data) {
                if (data.value == true) {
                    $scope.excelData = data.data;
                    console.log("aaaa", $scope.excelArrData);
                } else {
                    alert("aaaaa");
                }
            });
        };

        $scope.formData = {};
        $scope.mapExcelFields = function (formdata, formdata1) {
            // console.log("formdata[$scope.activeField]", formdata[$scope.activeField]);
            $scope.companyExcel = {};
            $scope.companyExcel.name = formdata1.file;
            $scope.companyExcel.fields = [];
            _.forEach(formdata, function (value, key) {
                $scope.field = {};
                $scope.field.ourField = key;
                $scope.field.theirField = value;
                $scope.companyExcel.fields.push($scope.field);
            });
            console.log("$scope.companyExcel", $scope.companyExcel);
            NavigationService.apiCall("ExcelUpload/finalUploadForCustomerNote", $scope.companyExcel, function (data) {
                if (data.value == true) {
                    console.log("Sucess#############################", data);
                    $scope.errData = data.data;
                    $scope.eData = {};
                    $scope.eData.tableName = 'CustomerNote';
                    $scope.eData.logs = data.data;
                    NavigationService.apiCall("AllLogs/save", $scope.eData, function (data) {
                        if (data.value == true) {
                            console.log("Sucess#############################", data);
                            alert("data submit Sucessfully");
                        }
                    });
                }
            });
        };
    }


    $scope.activeTabs = function (n) {
        $scope.activeJustified = n + 1;
        var getExcel;
        var mapExcel;
        var tableName;
        if ($scope.activeJustified == 1) {
            $scope.excelData = "";
            $scope.errData = "";
            getExcel = "customerNoteUpload";
            mapExcel = "finalUploadForCustomerNote";
            tableName = "CustomerNote";
        } else if ($scope.activeJustified == 2) {
            $scope.excelData = "";
            $scope.errData = "";
            getExcel = "crmUpload";
            mapExcel = "finalUploadForCrm";
            tableName = "Crm";
        } else if ($scope.activeJustified == 3) {
            $scope.excelData = "";
            $scope.errData = "";
            getExcel = "companyUpload";
            mapExcel = "finalUploadForCompany";
            tableName = "Company";
        } else if ($scope.activeJustified == 4) {
            $scope.excelData = "";
            $scope.errData = "";
            getExcel = "companyContactUpload";
            mapExcel = "companyContactUpload";
            tableName = "CompanyContact";
        } else if ($scope.activeJustified == 5) {
            $scope.excelData = "";
            $scope.errData = "";
            getExcel = "companyInfoUpload";
            mapExcel = "finalUploadForCompanyInfo";
            tableName = "CompanyInfo";
        } else if ($scope.activeJustified == 6) {
            $scope.excelData = "";
            $scope.errData = "";
            getExcel = "itemUpload";
            mapExcel = "finalUploadForItem";
            tableName = "Item";
        } else if ($scope.activeJustified == 7) {
            $scope.excelData = "";
            $scope.errData = "";
            getExcel = "LocationUpload";
            mapExcel = "finalUploadForLocation";
            tableName = "Locations";
        } else if ($scope.activeJustified == 8) {
            $scope.excelData = "";
            $scope.errData = "";
            getExcel = "TransactionUpload";
            mapExcel = "finalUploadForTransaction";
            tableName = "Transaction";
        } else if ($scope.activeJustified == 9) {
            $scope.excelData = "";
            $scope.errData = "";
            getExcel = "warrantyItemUpload";
            mapExcel = "finalUploadForWarranty";
            tableName = "WarrantyItem";
        }


        $scope.getExcelFields = function (formdata) {
            console.log("formdata", formdata);
            NavigationService.apiCall("ExcelUpload/" + getExcel, formdata, function (data) {
                if (data.value == true) {
                    // console.log("aaaa", data);
                    $scope.excelData = data.data;
                    console.log("excelData", $scope.excelData);
                } else {
                    alert("Incorrect Input  ");
                }
            });
        };

        $scope.formData = {};
        $scope.mapExcelFields = function (formdata, formdata1) {
            // console.log("formdata[$scope.activeField]", formdata[$scope.activeField]);
            $scope.companyExcel = {};
            $scope.companyExcel.name = formdata1.file;
            $scope.companyExcel.fields = [];
            _.forEach(formdata, function (value, key) {
                $scope.field = {};
                $scope.field.ourField = key;
                $scope.field.theirField = value;
                $scope.companyExcel.fields.push($scope.field);
            });
            console.log("$scope.companyExcel", $scope.companyExcel);
            NavigationService.apiCall("ExcelUpload/" + mapExcel, $scope.companyExcel, function (data) {
                if (data.value == true) {
                    console.log("#############1################", data);
                    $scope.errData = data.data;
                    $scope.eData = {};
                    $scope.eData.tableName = tableName;
                    $scope.eData.logs = data.data;
                    NavigationService.apiCall("AllLogs/save", $scope.eData, function (data) {
                        if (data.value == true) {
                            alert("data submit Sucessfully");
                        }
                    });
                }
            });
        };
    };

    $scope.getHistory = function (n) {
        NavigationService.apiCall("AllLogs/logHistory", $scope.eData, function (data) {
            if (data.value == true) {
                $scope.eData = data.data.found;
                console.log("eData--------------", $scope.eData);
                $scope.logData = data.data.found[0].info[0];
                console.log("logData--------------", $scope.logData);
                // _.forEach($scope.eData, function (value) {
                //     console.log(value);
                // });
                // $scope.sucessCount = data.data.succesCount;
                // $scope.errorCount = data.data.errorCount;
                // $scope.dateOfLogs = data.data.found[0]._id;
                // $scope.logData = data.data.found[0].info[0].status;
                // $scope.totalCount = $scope.sucessCount + $scope.errorCount;
                // console.log("dataHistory", $scope.dataHistory);
                // console.log("logData", $scope.logData);
                // console.log("error", $scope.errorCount);
                // console.log("total", $scope.totalCount);
            }
        });
    };

    // $scope.getExcelFields = function (formdata) {
    //     console.log("formdata", formdata);
    //     NavigationService.apiCall("ExcelUpload/companyUpload", formdata, function (data) {
    //         if (data.value == true) {
    //             $scope.excelData = data.data;
    //             console.log("aaaa", $scope.exclogs.infoelArrData);
    //         } else {
    //             alert("aaaaa");
    //         }
    //     });
    // };

    // $scope.formData = {};
    // $scope.mapExcelFields = function (formdatalogs.info, formdata1) {
    //     $scope.companyExcel = {};
    //     $scope.companyExcel.name = formdata1.file;
    //     $scope.companyExcel.fields = [];
    //     _.forEach(formdata, function (value, key) {
    //         $scope.field = {};
    //         $scope.field.ourField = key;
    //         $scope.field.theirField = value;
    //         $scope.companyExcel.fields.push($scope.field);
    //     });
    //     console.log("$scope.companyExcel", $scope.companyExcel);
    //     NavigationService.apiCall("ExcelUpload/finalUploadForCompany", $scope.companyExcel, function (data) {
    //         if (data.value == true) {
    //             console.log("Sucess");
    //         } else {
    //             alert("aaaaa");
    //         }
    //     });
    // };

});