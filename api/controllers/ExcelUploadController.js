var controller = {

    //till Register 

    tillRegisterUpload: function (req, res) {
        if (req.body.file) {
            var retJson = {};
            retJson.fields = [{
                    field: "organizationId",
                    description: "Date"
                }, {
                    field: "retailLocationId",
                    description: "String"
                }, {
                    field: "tillNumber",
                    description: "String"
                }, {
                    field: "date",
                    description: "date"
                }, {
                    field: "openingBalance",
                    description: "Number"
                }, {
                    field: "additions",
                    description: "Number"
                }, {
                    field: "systemBalance",
                    description: "Number"
                }, {
                    field: "actualBalance",
                    description: "Number"
                }, {
                    field: "bankDeposit",
                    description: "Number"
                }, {
                    field: "closingBalance",
                    description: "Number"
                }, {
                    field: "employeeNumber",
                    description: "String"
                }, {
                    field: "randomNumber",
                    description: "Number"
                }, {
                    field: "locationDataId",
                    description: "Number"
                }, {
                    field: "activdate",
                    description: "Date"
                }, {
                    field: "orgId",
                    description: "Number"
                }
                //  {
                //     field: "custId",
                //     description: "This is a Id"
                // }
            ]; //fields in schema
            Config.getGSExcelFields(req.body.file, function (err, data) {
                if (err || _.isEmpty(data)) {
                    res.callback(err);
                } else {
                    retJson.excelFields = _.sortBy(data, function (n) {
                        return n;
                    });
                    res.callback(null, retJson);
                }
            });
        } else {
            res.callback("Please provide File to be uploaded");
        }
    },

    finalUploadFortillRegister: function (req, res) {
        AllLogs.saveData({
            tableName: "TillRegister",
            status: "Pending"
        }, function (err, found) {
            res.callback(err, found._id);
            var allLogsId = found._id;
            Config.importGSForCustomFields(req.body.name, req.body.fields, function (err, data) {
                if (err || _.isEmpty(data)) {
                    res.callback(err);
                } else {
                    var sucessCount = 0;
                    var failureCount = 0;
                    async.waterfall([
                            function (callback) {
                                var i = 0;
                                async.concatSeries(data, function (singleData, callback) {
                                    singleData.date = new Date((singleData.date - (25567 + 1)) * 86400 * 1000);
                                    singleData.activdate = new Date((singleData.activdate - (25567 + 1)) * 86400 * 1000);
                                    TillRegister.saveOnExcel(singleData, function (err, data) {
                                        i++;
                                        console.log("Completed TillRegister " + i);
                                        if (err || _.isEmpty(data)) {
                                            failureCount++;
                                        } else {
                                            sucessCount++;
                                        }
                                        callback(null, {
                                            error: err,
                                            success: data,
                                            row: i
                                        });
                                    });
                                }, function (err, found) {
                                    eData = {};
                                    eData.logs = found;
                                    eData._id = allLogsId;
                                    eData.failureCount = failureCount;
                                    eData.sucessCount = sucessCount;
                                    eData.status = "Completed"
                                    AllLogs.saveData(eData, callback);
                                });
                            }
                        ],
                        function () {}
                    );
                }
            });
        });
    },

    //calender *

    calendarUpload: function (req, res) {
        if (req.body.file) {
            var retJson = {};
            retJson.fields = [{
                    field: "activityDate",
                    description: "String"
                }, {
                    field: "month",
                    description: "String"
                }, {
                    field: "year",
                    description: "String"
                }, {
                    field: "monthYear",
                    description: "String"
                }, {
                    field: "monthYearSequence",
                    description: "String"
                }, {
                    field: "quarter",
                    description: "String"
                }, {
                    field: "quarterYear",
                    description: "String"
                }, {
                    field: "quarterYearSequence",
                    description: "Date"
                }, {
                    field: "monthName",
                    description: "Date"
                }
                //  {
                //     field: "custId",
                //     description: "This is a Id"
                // }
            ]; //fields in schema
            Config.getGSExcelFields(req.body.file, function (err, data) {
                if (err || _.isEmpty(data)) {
                    res.callback(err);
                } else {
                    retJson.excelFields = _.sortBy(data, function (n) {
                        return n;
                    });
                    res.callback(null, retJson);
                }
            });
        } else {
            res.callback("Please provide File to be uploaded");
        }
    },

    finalUploadForCalendar: function (req, res) {
        AllLogs.saveData({
            tableName: "Calendar",
            status: "Pending"
        }, function (err, found) {
            res.callback(err, found._id);
            var allLogsId = found._id;
            console.log("allLogsId---------", allLogsId);
            Config.importGSForCustomFields(req.body.name, req.body.fields, function (err, data) {
                if (err || _.isEmpty(data)) {
                    res.callback(err);
                } else {
                    var sucessCount = 0;
                    var failureCount = 0;
                    async.waterfall([
                            function (callback) {
                                var i = 0;
                                async.concatSeries(data, function (singleData, callback) {
                                    singleData.activityDate = new Date((singleData.activityDate - (25567 + 1)) * 86400 * 1000);
                                    Calendar.saveData(singleData, function (err, data) {
                                        i++;
                                        console.log("Completed Calendar " + i);
                                        if (err || _.isEmpty(data)) {
                                            failureCount++;
                                        } else {
                                            sucessCount++;
                                        }
                                        callback(null, {
                                            error: err,
                                            success: data,
                                            row: i
                                        });
                                    });
                                }, function (err, found) {
                                    eData = {};
                                    eData.logs = found;
                                    eData._id = allLogsId;
                                    eData.failureCount = failureCount;
                                    eData.sucessCount = sucessCount;
                                    eData.status = "Completed"
                                    AllLogs.saveData(eData, callback);
                                });
                            }
                        ],
                        function () {}
                    );
                }
            });
        });

    },

    //company.. *

    companyUpload: function (req, res) {
        if (req.body.file) {
            var retJson = {};
            retJson.fields = [{
                    field: "organizationId",
                    description: "String"
                }, {
                    field: "name",
                    description: "String"
                }, {
                    field: "region",
                    description: "String"
                }, {
                    field: "textCode",
                    description: "String"
                }, {
                    field: "textSequence",
                    description: "String"
                }, {
                    field: "textSubcode",
                    description: "String"
                }, {
                    field: "receiptText",
                    description: "String"
                }, {
                    field: "effectiveDate",
                    description: "Date"
                }, {
                    field: "expirationDate",
                    description: "Date"
                }, {
                    field: "recordState",
                    description: "String"
                }, {
                    field: "lineFormat",
                    description: "String"
                }, {
                    field: "reformat",
                    description: "String"
                }, {
                    field: "category",
                    description: "String"
                }, {
                    field: "beginRange",
                    description: "String"
                }, {
                    field: "endRange",
                    description: "String"
                }, {
                    field: "cost",
                    description: "Number"
                }, {
                    field: "minimumCost",
                    description: "Number"
                }, {
                    field: "maximumCost",
                    description: "Number"
                }, {
                    field: "itemId",
                    description: "String"
                },
                //  {
                //     field: "custId",
                //     description: "This is a Id"
                // }
            ]; //fields in schema
            Config.getGSExcelFields(req.body.file, function (err, data) {
                if (err || _.isEmpty(data)) {
                    res.callback(err);
                } else {
                    retJson.excelFields = _.sortBy(data, function (n) {
                        return n;
                    });
                    res.callback(null, retJson);
                }
            });
        } else {
            res.callback("Please provide File to be uploaded");
        }
    },

    finalUploadForCompany: function (req, res) {
        AllLogs.saveData({
            tableName: "Company",
            status: "Pending"
        }, function (err, found) {
            res.callback(err, found._id);
            var allLogsId = found._id;
            Config.importGSForCustomFields(req.body.name, req.body.fields, function (err, data) {
                if (err || _.isEmpty(data)) {
                    res.callback(err);
                } else {
                    var sucessCount = 0;
                    var failureCount = 0;
                    async.waterfall([
                            function (callback) {
                                var i = 0;
                                async.concatSeries(data, function (singleData, callback) {
                                    Company.saveData(singleData, function (err, data) {
                                        i++;
                                        console.log("Completed Company " + i);
                                        if (err || _.isEmpty(data)) {
                                            failureCount++;
                                        } else {
                                            sucessCount++;
                                        }
                                        callback(null, {
                                            error: err,
                                            success: data,
                                            row: i
                                        });
                                    });
                                }, function (err, found) {
                                    eData = {};
                                    eData.logs = found;
                                    eData._id = allLogsId;
                                    eData.failureCount = failureCount;
                                    eData.sucessCount = sucessCount;
                                    eData.status = "Completed"
                                    AllLogs.saveData(eData, callback);
                                });
                            }
                        ],
                        function () {}
                    );
                }
            });
        });

    },

    // companyContact upload

    companyContactUpload: function (req, res) {
        if (req.body.file) {
            var retJson = {};
            retJson.fields = [{
                    field: "organizationId",
                    description: "String"
                }, {
                    field: "phoneNumberId",
                    description: "String"
                }, {
                    field: "phoneNumber",
                    description: "Number"
                }, {
                    field: "phoneTypeCode",
                    description: "String"
                }, {
                    field: "contactDiscription",
                    description: "String"
                }, {
                    field: "sortOrder",
                    description: "String"
                },
                // {
                //     field: "custId",
                //     description: "This is a Id"
                // }
            ];
            Config.getGSExcelFields(req.body.file, function (err, data) {
                if (err || _.isEmpty(data)) {
                    res.callback(err);
                } else {
                    retJson.excelFields = _.sortBy(data, function (n) {
                        return n;
                    });
                    res.callback(null, retJson);
                }
            });
        } else {
            res.callback("Please provide File to be uploaded");
        }
    },

    finalUploadForCompanyContact: function (req, res) {
        AllLogs.saveData({
            tableName: "CompanyContact",
            status: "Pending"
        }, function (err, found) {
            res.callback(err, found._id);
            var allLogsId = found._id;
            Config.importGSForCustomFields(req.body.name, req.body.fields, function (err, data) {
                if (err || _.isEmpty(data)) {
                    res.callback(err);
                } else {
                    var sucessCount = 0;
                    var failureCount = 0;
                    async.waterfall([
                            function (callback) {
                                var i = 0;
                                async.concatSeries(data, function (singleData, callback) {
                                    CompanyContact.saveOnExcel(singleData, function (err, data) { //for mapping id's from diffent tables 
                                        i++;
                                        console.log("Completed CompanyContact " + i);
                                        if (err || _.isEmpty(data)) {
                                            failureCount++;
                                        } else {
                                            sucessCount++;
                                        }
                                        callback(null, {
                                            error: err,
                                            success: data,
                                            row: i
                                        });
                                    });
                                }, function (err, found) {
                                    eData = {};
                                    eData.logs = found;
                                    eData._id = allLogsId;
                                    eData.failureCount = failureCount;
                                    eData.sucessCount = sucessCount;
                                    eData.status = "Completed"
                                    AllLogs.saveData(eData, callback);
                                });
                            }
                        ],
                        function () {}
                    );
                }
            });
        });

    },


    //companyInfo

    companyInfoUpload: function (req, res) {
        if (req.body.file) {
            var retJson = {};
            retJson.fields = [{
                    field: "organizationId",
                    description: "String"
                }, {
                    field: "reasonTypeCode",
                    description: "String"
                }, {
                    field: "reasonCode",
                    description: "String"
                }, {
                    field: "description",
                    description: "String"
                }, {
                    field: "commentRequired",
                    description: "String"
                }, {
                    field: "sortOrder",
                    description: "String"
                }, {
                    field: "parentCode",
                    description: "String"
                }, {
                    field: "glAccountNumber",
                    description: "Number"
                }, {
                    field: "minimumAmt",
                    description: "Number"
                }, {
                    field: "maximumAmt",
                    description: "Number"
                }, {
                    field: "privilegeType",
                    description: "String"
                }, {
                    field: "customerMessage",
                    description: "String"
                }, {
                    field: "inventoryActionCode",
                    description: "String"
                }, {
                    field: "inventoryLocationId",
                    description: "String"
                }, {
                    field: "inventoryBucketId",
                    description: "String"
                },
                //  {
                //     field: "custId",
                //     description: "This is a Id"
                // }
            ];
            Config.getGSExcelFields(req.body.file, function (err, data) {
                if (err || _.isEmpty(data)) {
                    res.callback(err);
                } else {
                    retJson.excelFields = _.sortBy(data, function (n) {
                        return n;
                    });
                    res.callback(null, retJson);
                }
            });
        } else {
            res.callback("Please provide File to be uploaded");
        }
    },

    finalUploadForCompanyInfo: function (req, res) {
        AllLogs.saveData({
            tableName: "CompanyInfo",
            status: "Pending"
        }, function (err, found) {
            res.callback(err, found._id);
            var allLogsId = found._id;
            Config.importGSForCustomFields(req.body.name, req.body.fields, function (err, data) {
                if (err || _.isEmpty(data)) {
                    res.callback(err);
                } else {
                    var sucessCount = 0;
                    var failureCount = 0;
                    async.waterfall([
                            function (callback) {
                                var i = 0;
                                async.concatSeries(data, function (singleData, callback) {
                                    CompanyInfo.saveOnExcel(singleData, function (err, data) { //for mapping id's from diffent tables 
                                        i++;
                                        console.log("Completed CompanyInfo " + i);
                                        if (err || _.isEmpty(data)) {
                                            failureCount++;
                                        } else {
                                            sucessCount++;
                                        }
                                        callback(null, {
                                            error: err,
                                            success: data,
                                            row: i
                                        });
                                    });
                                }, function (err, found) {
                                    eData = {};
                                    eData.logs = found;
                                    eData._id = allLogsId;
                                    eData.failureCount = failureCount;
                                    eData.sucessCount = sucessCount;
                                    eData.status = "Completed"
                                    AllLogs.saveData(eData, callback);
                                });
                            }
                        ],
                        function () {}
                    );
                }
            });
        });

    },


    //crm

    crmUpload: function (req, res) {
        if (req.body.file) {
            var retJson = {};
            retJson.fields = [{
                    field: "organizationId",
                    description: "String"
                }, {
                    field: "customerGroupId",
                    description: "String"
                }, {
                    field: "customerId",
                    description: "String"
                }, {
                    field: "customerNumber",
                    description: "String"
                }, {
                    field: "salutation",
                    description: "String"
                }, {
                    field: "firstName",
                    description: "String"
                }, {
                    field: "middleName",
                    description: "String"
                }, {
                    field: "lastName",
                    description: "String"
                }, {
                    field: "gender",
                    description: "String"
                }, {
                    field: "totalTransactionCount",
                    description: "Number"
                }, {
                    field: "totalSoldItemCount",
                    description: "Number"
                }, {
                    field: "ytdReturnsAmount",
                    description: "Number"
                }, {
                    field: "partyId",
                    description: "String"
                }, {
                    field: "idVerificationRequired",
                    description: "Boolean"
                }, {
                    field: "partyId1",
                    description: "String"
                }, {
                    field: "totalReturnedItemCount",
                    description: "Number"
                }, {
                    field: "totalReturnsAmount",
                    description: "Number"
                }, {
                    field: "totalSalesAmount",
                    description: "Number"
                }, {
                    field: "ytdReturnedItemCount",
                    description: "Number"
                }, {
                    field: "ytdSalesAmount",
                    description: "Number"
                }, {
                    field: "ytdSoldItemCount",
                    description: "Number"
                }, {
                    field: "ytdTransactionCount",
                    description: "Number"
                }, {
                    field: "allegianceRetailLocationId",
                    description: "String"
                }, {
                    field: "birthDate",
                    description: "Date"
                }, {
                    field: "customerLevelCode",
                    description: "String"
                }, {
                    field: "employeeId",
                    description: "String"
                }, {
                    field: "federalTaxId",
                    description: "String"
                }, {
                    field: "legalStatusCode",
                    description: "String"
                }, {
                    field: "mailingList",
                    description: "String"
                }, {
                    field: "organizationName",
                    description: "String"
                }, {
                    field: "organizationTypeCode",
                    description: "String"
                }, {
                    field: "partyTypeCode",
                    description: "String"
                }, {
                    field: "pictureUri",
                    description: "String"
                }, {
                    field: "signUpRetailLocationId",
                    description: "String"
                }, {
                    field: "socialSecurityNumber",
                    description: "Number"
                }, {
                    field: "stateTaxId",
                    description: "String"
                }, {
                    field: "suffix",
                    description: "String"
                }, {
                    field: "void",
                    description: "String"
                }, {
                    field: "anniversaryDate",
                    description: "Date"
                }, {
                    field: "emailContact",
                    description: "String"
                }, {
                    field: "privacyCard",
                    description: "String"
                }, {
                    field: "commercialCustomer",
                    description: "String"
                }, {
                    field: "recordState",
                    description: "String"
                }, {
                    field: "processDate",
                    description: "Date"
                }, {
                    field: "customerGroups",
                    description: "String"
                }, {
                    field: "creatorPartyId",
                    description: "String"
                }, {
                    field: "creatorParty",
                    description: "String"
                }, {
                    field: "loyaltyProgramNumber",
                    description: "String"
                },
                {
                    field: "orgId",
                    description: "Number"
                },
                {
                    field: "custId",
                    description: "String"
                }
                // {
                //     field: "custId",
                //     description: "This is a Id"
                // }
            ];
            Config.getGSExcelFields(req.body.file, function (err, data) {
                if (err || _.isEmpty(data)) {
                    res.callback(err);
                } else {
                    retJson.excelFields = _.sortBy(data, function (n) {
                        return n;
                    });
                    res.callback(null, retJson);
                }
            });
        } else {
            res.callback("Please provide File to be uploaded");
        }
    },

    finalUploadForCrm: function (req, res) {
        AllLogs.saveData({
            tableName: "Crm",
            status: "Pending"
        }, function (err, found) {
            res.callback(err, found._id);
            var allLogsId = found._id;
            Config.importGSForCustomFields(req.body.name, req.body.fields, function (err, data) {
                if (err || _.isEmpty(data)) {
                    res.callback(err);
                } else {
                    var sucessCount = 0;
                    var failureCount = 0;
                    async.waterfall([
                            function (callback) {
                                var i = 0;
                                async.concatSeries(data, function (singleData, callback) {

                                    Crm.saveOnExcel(singleData, function (err, data) { //for mapping id's from diffent tables 
                                        i++;
                                        console.log("Completed Crm " + i);
                                        if (err || _.isEmpty(data)) {
                                            failureCount++;
                                        } else {
                                            sucessCount++;
                                        }
                                        callback(null, {
                                            error: err,
                                            success: data,
                                            row: i
                                        });
                                    });
                                }, function (err, found) {
                                    eData = {};
                                    eData.logs = found;
                                    eData._id = allLogsId;
                                    eData.failureCount = failureCount;
                                    eData.sucessCount = sucessCount;
                                    eData.status = "Completed"
                                    AllLogs.saveData(eData, callback);
                                });
                            }
                        ],
                        function () {}
                    );
                }
            });
        });

    },


    //customer Contact*

    customerUpload: function (req, res) {
        if (req.body.file) {
            var retJson = {};
            retJson.fields = [{
                    field: "customerId",
                    description: "String"
                },
                {
                    field: "addressID",
                    description: "String"
                }, {
                    field: "address1",
                    description: "String"
                }, {
                    field: "address2",
                    description: "String"
                }, {
                    field: "apartment",
                    description: "String"
                }, {
                    field: "city",
                    description: "String"
                }, {
                    field: "country",
                    description: "String"
                }, {
                    field: "postalCode",
                    description: "String"
                }, {
                    field: "state",
                    description: "String"
                }, {
                    field: "email",
                    description: "String"
                },
                // {
                //     field: "custId",
                //     description: "This is a Id"
                // }
            ];
            Config.getGSExcelFields(req.body.file, function (err, data) {
                if (err || _.isEmpty(data)) {
                    res.callback(err);
                } else {
                    retJson.excelFields = _.sortBy(data, function (n) {
                        return n;
                    });
                    res.callback(null, retJson);
                }
            });
        } else {
            res.callback("Please provide File to be uploaded");
        }
    },

    finalUploadForCustomer: function (req, res) {
        AllLogs.saveData({
            tableName: "Customer",
            status: "Pending"
        }, function (err, found) {
            res.callback(err, found._id);
            var allLogsId = found._id;
            Config.importGSForCustomFields(req.body.name, req.body.fields, function (err, data) {
                if (err || _.isEmpty(data)) {
                    res.callback(err);
                } else {
                    var sucessCount = 0;
                    var failureCount = 0;
                    async.waterfall([
                            function (callback) {
                                var i = 0;
                                async.concatSeries(data, function (singleData, callback) {

                                    Customer.saveData(singleData, function (err, data) {
                                        i++;
                                        console.log("Completed Customer" + i);
                                        if (err || _.isEmpty(data)) {
                                            failureCount++;
                                        } else {
                                            sucessCount++;
                                        }
                                        callback(null, {
                                            error: err,
                                            success: data,
                                            row: i
                                        });
                                    });
                                }, function (err, found) {
                                    eData = {};
                                    eData.logs = found;
                                    eData._id = allLogsId;
                                    eData.failureCount = failureCount;
                                    eData.sucessCount = sucessCount;
                                    eData.status = "Completed"
                                    AllLogs.saveData(eData, callback);
                                });
                            }
                        ],
                        function () {}
                    );
                }
            });
        });

    },


    //customerNote

    customerNoteUpload: function (req, res) {
        if (req.body.file) {
            var retJson = {};
            retJson.fields = [{
                    field: "customerId",
                    description: "Note Sequence a number that can not be greater than 65000"
                }, {
                    field: "noteSequence",
                    description: "Note Sequence a number that can not be greater than 65000"
                }, {
                    field: "note",
                    description: "This is a string of length less than 140 characters."
                }, {
                    field: "noteTimeStamp",
                    description: "This is a timestamp"
                },
                // {
                //     field: "custId",
                //     description: "This is a Id"
                // }
            ];
            Config.getGSExcelFields(req.body.file, function (err, data) {
                if (err || _.isEmpty(data)) {
                    res.callback(err);
                } else {
                    retJson.excelFields = _.sortBy(data, function (n) {
                        return n;
                    });
                    res.callback(null, retJson);
                }
            });
        } else {
            res.callback("Please provide File to be uploaded");
        }
    },

    finalUploadForCustomerNote: function (req, res) {
        AllLogs.saveData({
            tableName: "CustomerNote",
            status: "Pending"
        }, function (err, found) {
            res.callback(err, found._id);
            var allLogsId = found._id;
            Config.importGSForCustomFields(req.body.name, req.body.fields, function (err, data) {
                if (err || _.isEmpty(data)) {
                    res.callback(err);
                } else {
                    var sucessCount = 0;
                    var failureCount = 0;
                    async.waterfall([
                            function (callback) {
                                var i = 0;
                                async.concatSeries(data, function (singleData, callback) {

                                    CustomerNote.saveOnExcel(singleData, function (err, data) { //for mapping id's from diffent tables 
                                        i++;
                                        console.log("Completed CustomerNote" + i);
                                        if (err || _.isEmpty(data)) {
                                            failureCount++;
                                        } else {
                                            sucessCount++;
                                        }
                                        callback(null, {
                                            error: err,
                                            success: data,
                                            row: i
                                        });
                                    });
                                }, function (err, found) {
                                    eData = {};
                                    eData.logs = found;
                                    eData._id = allLogsId;
                                    eData.failureCount = failureCount;
                                    eData.sucessCount = sucessCount;
                                    eData.status = "Completed"
                                    AllLogs.saveData(eData, callback);
                                });
                            }
                        ],
                        function () {}
                    );
                }
            });
        });

    },


    //itemId

    itemUpload: function (req, res) {
        if (req.body.file) {
            var retJson = {};
            retJson.fields = [{
                    field: "organizationId",
                    description: "String"
                },
                {
                    field: "itemId",
                    description: "String"
                }, {
                    field: "promptToAdd",
                    description: "String"
                }, {
                    field: "applyRestockingFee",
                    description: "String"
                }, {
                    field: "disallowDiscounts",
                    description: "String"
                }, {
                    field: "disallowPriceChange",
                    description: "String"
                }, {
                    field: "forceQuantityOfOne",
                    description: "String"
                }, {
                    field: "frequentShopperPointsCount",
                    description: "String"
                }, {
                    field: "frequentShopperPointsIneligible",
                    description: "String"
                }, {
                    field: "itemUrl",
                    description: "String"
                }, {
                    field: "maximumSaleUnitCount",
                    description: "Number"
                }, {
                    field: "minimumSaleUnitCount",
                    description: "Number"
                }, {
                    field: "listPrice",
                    description: "Number"
                }, {
                    field: "noGiveaways",
                    description: "String"
                }, {
                    field: "notInventoried",
                    description: "String"
                }, {
                    field: "notReturnable",
                    description: "String"
                }, {
                    field: "restockingFee",
                    description: "String"
                }, {
                    field: "hazardousMaterial",
                    description: "String"
                }, {
                    field: "noRainCheckAllowed",
                    description: "String"
                }, {
                    field: "minAgeRequired",
                    description: "Number"
                }, {
                    field: "foodStampEligible",
                    description: "String"
                }, {
                    field: "shippingWeight",
                    description: "Number"
                }, {
                    field: "manufacturerUpc",
                    description: "String"
                }, {
                    field: "manufacturer",
                    description: "String"
                }, {
                    field: "restrictionCategory",
                    description: "String"
                }, {
                    field: "restrictionCode",
                    description: "String"
                }, {
                    field: "region",
                    description: "String"
                }, {
                    field: "dayCode",
                    description: "String"
                }, {
                    field: "effectiveDate",
                    description: "Date"
                }, {
                    field: "startTime",
                    description: "Date"
                }, {
                    field: "expirationDate",
                    description: "Date"
                }, {
                    field: "endTime",
                    description: "Date"
                }, {
                    field: "itemLevelCode",
                    description: "String"
                }, {
                    field: "itemTypeCode",
                    description: "String"
                }, {
                    field: "warrantyItemId",
                    description: "String"
                }, {
                    field: "itemCeilingPrice",
                    description: "Number"
                }, {
                    field: "ceilingPriceType",
                    description: "String"
                }, {
                    field: "zlcWarrantyItem",
                    description: "String"
                }, {
                    field: "warrantyNumber",
                    description: "Number"
                }, {
                    field: "warrantyTypeCode",
                    description: "String"
                }, {
                    field: "serviceNumber",
                    description: "Number"
                }, {
                    field: "serviceDate",
                    description: "Date"
                }, {
                    field: "serviceByEmployee",
                    description: "String"
                }, {
                    field: "serviceTypeCode",
                    description: "String"
                }, {
                    field: "serviceProviderId",
                    description: "String"
                }, {
                    field: "groupName",
                    description: "String"
                }, {
                    field: "beginDate",
                    description: "Date"
                }, {
                    field: "endDate",
                    description: "Date"
                }, {
                    field: "sequence",
                    description: "String"
                }, {
                    field: "vendorType",
                    description: "String"
                }, {
                    field: "vendorId",
                    description: "String"
                }, {
                    field: "description",
                    description: "String"
                }, {
                    field: "subClassId",
                    description: "String"
                },
                {
                    field: "orgId",
                    description: "String"
                },
                {
                    field: "warrantyItem",
                    description: "String"
                }
                //  {
                //     field: "custId",
                //     description: "This is a Id"
                // }
            ];
            Config.getGSExcelFields(req.body.file, function (err, data) {
                if (err || _.isEmpty(data)) {
                    res.callback(err);
                } else {
                    retJson.excelFields = _.sortBy(data, function (n) {
                        return n;
                    });
                    res.callback(null, retJson);
                }
            });
        } else {
            res.callback("Please provide File to be uploaded");
        }
    },

    finalUploadForItem: function (req, res) {
        AllLogs.saveData({
            tableName: "Item",
            status: "Pending"
        }, function (err, found) {
            res.callback(err, found._id);
            var allLogsId = found._id;
            Config.importGSForCustomFields(req.body.name, req.body.fields, function (err, data) {
                if (err || _.isEmpty(data)) {
                    res.callback(err);
                } else {
                    var sucessCount = 0;
                    var failureCount = 0;
                    async.waterfall([
                            function (callback) {
                                var i = 0;
                                async.concatSeries(data, function (singleData, callback) {
                                    Item.saveOnExcel(singleData, function (err, data) { //for mapping id's from diffent tables 
                                        i++;
                                        console.log("Completed Item" + i);
                                        if (err || _.isEmpty(data)) {
                                            failureCount++;
                                        } else {
                                            sucessCount++;
                                        }
                                        callback(null, {
                                            error: err,
                                            success: data,
                                            row: i
                                        });
                                    });
                                }, function (err, found) {
                                    eData = {};
                                    eData.logs = found;
                                    eData._id = allLogsId;
                                    eData.failureCount = failureCount;
                                    eData.sucessCount = sucessCount;
                                    eData.status = "Completed"
                                    AllLogs.saveData(eData, callback);
                                });
                            }
                        ],
                        function () {}
                    );
                }
            });
        });


    },


    //location

    LocationUpload: function (req, res) {
        if (req.body.file) {
            var retJson = {};
            retJson.fields = [{
                    field: "organizationId",
                    description: "String"
                }, {
                    field: "retailLocationId",
                    description: "String"
                }, {
                    field: "storeNumber",
                    description: "String"
                }, {
                    field: "storeName",
                    description: "String"
                }, {
                    field: "description",
                    description: "String"
                }, {
                    field: "effectiveDate",
                    description: "Date"
                }, {
                    field: "expirationDate",
                    description: "Date"
                }, {
                    field: "apartment",
                    description: "String"
                }, {
                    field: "address1",
                    description: "String"
                }, {
                    field: "address2",
                    description: "String"
                }, {
                    field: "city",
                    description: "String"
                }, {
                    field: "country",
                    description: "String"
                }, {
                    field: "postalCode",
                    description: "String"
                }, {
                    field: "state",
                    description: "String"
                }, {
                    field: "telephone1",
                    description: "Number"
                }, {
                    field: "telephone2",
                    description: "Number"
                }, {
                    field: "telephone3",
                    description: "Number"
                }, {
                    field: "telephone4",
                    description: "Number"
                }, {
                    field: "region",
                    description: "String"
                }, {
                    field: "loc",
                    description: "Number"
                }, {
                    field: "taxPercentage",
                    description: "String"
                }, {
                    field: "storeManager",
                    description: "String"
                }, {
                    field: "locationType",
                    description: "String"
                }, {
                    field: "deliveryAvailable",
                    description: "String"
                }, {
                    field: "pickupAvailable",
                    description: "String"
                }, {
                    field: "transferAvailable",
                    description: "String"
                }, {
                    field: "email",
                    description: "String"
                }, {
                    field: "geoCode",
                    description: "String"
                },
                {
                    field: "latitude",
                    description: "Number"
                },
                {
                    field: "longitude",
                    description: "Number"
                },
                {
                    field: "orgId",
                    description: "Number"
                }
                // {
                //     field: "custId",
                //     description: "This is a Id"
                // }
            ];
            Config.getGSExcelFields(req.body.file, function (err, data) {
                if (err || _.isEmpty(data)) {
                    res.callback(err);
                } else {
                    retJson.excelFields = _.sortBy(data, function (n) {
                        return n;
                    });
                    res.callback(null, retJson);
                }
            });
        } else {
            res.callback("Please provide File to be uploaded");
        }
    },

    finalUploadForLocation: function (req, res) {
        AllLogs.saveData({
            tableName: "Locations",
            status: "Pending"
        }, function (err, found) {
            res.callback(err, found._id);
            var allLogsId = found._id;
            Config.importGSForCustomFields(req.body.name, req.body.fields, function (err, data) {
                if (err || _.isEmpty(data)) {
                    res.callback(err);
                } else {
                    var sucessCount = 0;
                    var failureCount = 0;
                    async.waterfall([
                            function (callback) {
                                var i = 0;
                                async.concatSeries(data, function (singleData, callback) {

                                    Locations.saveOnExcel(singleData, function (err, data) { //for mapping id's from diffent tables 
                                        i++;
                                        console.log("Completed Locations" + i);
                                        if (err || _.isEmpty(data)) {
                                            failureCount++;
                                        } else {
                                            sucessCount++;
                                        }
                                        callback(null, {
                                            error: err,
                                            success: data,
                                            row: i
                                        });
                                    });
                                }, function (err, found) {
                                    eData = {};
                                    eData.logs = found;
                                    eData._id = allLogsId;
                                    eData.failureCount = failureCount;
                                    eData.sucessCount = sucessCount;
                                    eData.status = "Completed"
                                    AllLogs.saveData(eData, callback);
                                });
                            }
                        ],
                        function () {}
                    );
                }
            });
        });

    },


    //transaction

    TransactionUpload: function (req, res) {
        if (req.body.file) {
            var retJson = {};
            retJson.fields = [{
                    field: "records",
                    description: "Date"
                }, {
                    field: "organizationId",
                    description: "Date"
                }, {
                    field: "businessDate",
                    description: "Date"
                }, {
                    field: "retailLocationId",
                    description: "String"
                }, {
                    field: "transactionSequence",
                    description: "String"
                }, {
                    field: "workstationId",
                    description: "String"
                }, {
                    field: "retailTransactionLineItemSequence",
                    description: "String"
                }, {
                    field: "transactionType",
                    description: "String"
                }, {
                    field: "paymentMode",
                    description: "String"
                }, {
                    field: "randNoTransactionVoidFlag",
                    description: "String"
                },
                {
                    field: "transactionVoidFlag",
                    description: "String"
                },
                {
                    field: "transactionNumber",
                    description: "String"
                },
                {
                    field: "transactionReferenceNumber",
                    description: "String"
                }, {
                    field: "cardNumber",
                    description: "Number"
                },
                {
                    field: "tillNumber",
                    description: "Number"
                }, {
                    field: "itemId",
                    description: "Number"
                },
                {
                    field: "quantity",
                    description: "Number"
                }, {
                    field: "amount",
                    description: "Number"
                }, {
                    field: "netAmount",
                    description: "Number"
                }, {
                    field: "custAccountId",
                    description: "Number"
                }, {
                    field: "activityDate",
                    description: "Date"
                }, {
                    field: "time",
                    description: "Date"
                }, {
                    field: "customerId",
                    description: "String"
                }, {
                    field: "randomNoForCustId",
                    description: "String"
                }, {
                    field: "custAccountCode",
                    description: "String"
                }, {
                    field: "effectiveDate",
                    description: "Date"
                }, {
                    field: "expirationDate",
                    description: "Date"
                }, {
                    field: "startTime",
                    description: "Date"
                }, {
                    field: "endTime",
                    description: "Date"
                }, {
                    field: "loyaltyProgramId",
                    description: "String"
                }, {
                    field: "historySequence",
                    description: "String"
                }, {
                    field: "customerGroupId",
                    description: "String"
                },
                {
                    field: "locationDataId",
                    description: "String"
                },
                {
                    field: "activdate",
                    description: "String"
                },
                {
                    field: "orgId",
                    description: "String"
                },
                {
                    field: "itemDataId",
                    description: "String"
                },
                {
                    field: "tillNum",
                    description: "String"
                },
                {
                    field: "custId",
                    description: "String"
                }
                // {
                //     field: "custId",
                //     description: "This is a Id"
                // }
            ];
            Config.getGSExcelFields(req.body.file, function (err, data) {
                if (err || _.isEmpty(data)) {
                    res.callback(err);
                } else {
                    retJson.excelFields = _.sortBy(data, function (n) {
                        return n;
                    });
                    res.callback(null, retJson);
                }
            });
        } else {
            res.callback("Please provide File to be uploaded");
        }
    },

    finalUploadForTransaction: function (req, res) {
        AllLogs.saveData({
            tableName: "Transaction",
            status: "Pending"
        }, function (err, found) {
            res.callback(err, found._id);
            var allLogsId = found._id;
            Config.importGSForCustomFields(req.body.name, req.body.fields, function (err, data) {
                if (err || _.isEmpty(data)) {
                    res.callback(err);
                } else {
                    var sucessCount = 0;
                    var failureCount = 0;
                    var saveExcelData = [];
                    async.waterfall([
                            function (callback) {
                                var i = 0;
                                async.concatSeries(data, function (singleData, callback) {
                                    singleData.activityDate = new Date((singleData.activityDate - (25567 + 1)) * 86400 * 1000);
                                    singleData.activdate = new Date((singleData.activdate - (25567 + 1)) * 86400 * 1000);
                                    async.waterfall([
                                            function (callback) {
                                                Transaction.saveOnExcel(singleData, function (err, data) { //for mapping id's from diffent tables 
                                                    i++;
                                                    console.log("Completed Transactions " + i);
                                                    if (err || _.isEmpty(data)) {
                                                        failureCount++;
                                                    } else {
                                                        sucessCount++;
                                                    }
                                                    callback(null, {
                                                        error: err,
                                                        success: data,
                                                        row: i
                                                    });
                                                });
                                            },
                                            function (data, callback) {
                                                saveExcelData.push(data);
                                                if (data.success != null) {
                                                    var tranId = {};
                                                    tranId.transactionId = data.success._id;
                                                    RuleEngine.checkViolationForTransaction(tranId, callback);
                                                } else {
                                                    callback(null, null);
                                                }
                                            }
                                        ],
                                        function (err, results) {
                                            if (err || _.isEmpty(results)) {
                                                callback(err);
                                            } else {
                                                callback(null, results);
                                            }
                                        }
                                    );
                                }, function (err, found) {
                                    eData = {};
                                    eData.logs = saveExcelData;
                                    eData._id = allLogsId;
                                    eData.failureCount = failureCount;
                                    eData.sucessCount = sucessCount;
                                    eData.status = "Completed"
                                    AllLogs.saveData(eData, callback);
                                });
                            }
                        ],
                        function () {}
                    );
                }
            });
        });
    },

    //warrantyItem *

    warrantyItemUpload: function (req, res) {
        if (req.body.file) {
            var retJson = {};
            retJson.fields = [{
                    field: "warrantyItemId",
                    description: "String"
                }, {
                    field: "warrantyType",
                    description: "String"
                }, {
                    field: "warrantySubtype",
                    description: "String"
                }, {
                    field: "description",
                    description: "String"
                }, {
                    field: "replaceType",
                    description: "String"
                },

                // {
                //     field: "custId",
                //     description: "This is a Id"
                // }
            ];
            Config.getGSExcelFields(req.body.file, function (err, data) {
                if (err || _.isEmpty(data)) {
                    res.callback(err);
                } else {
                    retJson.excelFields = _.sortBy(data, function (n) {
                        return n;
                    });
                    res.callback(null, retJson);
                }
            });
        } else {
            res.callback("Please provide File to be uploaded");
        }
    },

    finalUploadForWarranty: function (req, res) {
        AllLogs.saveData({
            tableName: "WarrantyItem",
            status: "Pending"
        }, function (err, found) {
            res.callback(err, found._id);
            var allLogsId = found._id;
            Config.importGSForCustomFields(req.body.name, req.body.fields, function (err, data) {
                if (err || _.isEmpty(data)) {
                    res.callback(err);
                } else {
                    var sucessCount = 0;
                    var failureCount = 0;
                    async.waterfall([
                            function (callback) {
                                var i = 0;
                                async.concatSeries(data, function (singleData, callback) {
                                    WarrantyItem.saveData(singleData, function (err, data) {
                                        i++;
                                        console.log("Completed WarrantyItem " + i);
                                        if (err || _.isEmpty(data)) {
                                            failureCount++;
                                        } else {
                                            sucessCount++;
                                        }
                                        callback(null, {
                                            error: err,
                                            success: data,
                                            row: i
                                        });
                                    });
                                }, function (err, found) {
                                    eData = {};
                                    eData.logs = found;
                                    eData._id = allLogsId;
                                    eData.failureCount = failureCount;
                                    eData.sucessCount = sucessCount;
                                    eData.status = "Completed"
                                    AllLogs.saveData(eData, callback);
                                });
                            }
                        ],
                        function () {}
                    );
                }
            });
        });

    },


    //user

    userUpload: function (req, res) {
        if (req.body.file) {
            var retJson = {};
            retJson.fields = [
                "name", "email", "dob", "photo", "password", "mobile", "otp", "accessToken", "accessLevel"
            ];
            Config.getGSExcelFields(req.body.file, function (err, data) {
                if (err || _.isEmpty(data)) {
                    res.callback(err);
                } else {
                    retJson.excelFields = _.sortBy(data, function (n) {
                        return n;
                    });
                    res.callback(null, retJson);
                }
            });
        } else {
            res.callback("Please provide File to be uploaded");
        }
    },

    finalUploadForUser: function (req, res) {
        Config.importGSForCustomFields(req.body.name, req.body.fields, function (err, data) {
            if (err || _.isEmpty(data)) {
                res.callback(err);
            } else {
                async.concatSeries(data, function (singleData, callback) {
                    if (singleData.custId) {
                        Customer.findOne({
                            custId: singleData.custId
                        }).exec(function (err, found) {
                            if (err) {
                                callback(err, null);
                            } else {
                                if (found) {
                                    singleData.custId = found._id;
                                    User.saveData(singleData, function (err, data) {
                                        callback(null, {
                                            error: err,
                                            success: data
                                        });
                                    });
                                } else {
                                    callback({
                                        message: "Incorrect Credentials!"
                                    }, null);
                                }
                            }

                        });
                    } else {
                        User.saveData(singleData, function (err, data) {
                            callback(null, {
                                error: err,
                                success: data
                            });
                        });
                    }
                }, res.callback);
            }
        });
    },


};
module.exports = controller;