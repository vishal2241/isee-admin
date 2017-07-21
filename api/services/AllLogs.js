    var schema = new Schema({
        tableName: {
            type: String
        },
        logs: {
            type: Schema.Types.Mixed
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            index: true
        },
    });

    schema.plugin(deepPopulate, {
        populate: {
            user: {
                select: ""
            }
        }
    });
    schema.plugin(uniqueValidator);
    schema.plugin(timestamps);
    module.exports = mongoose.model('AllLogs', schema);

    var exports = _.cloneDeep(require("sails-wohlig-service")(schema, 'user', 'user'));
    var model = {

        logHistory: function (data, callback) {
            AllLogs.aggregate([{
                $group: {
                    "_id": "$createdAt",
                    info: {
                        $push: "$logs"
                    }
                }
            }], function (err, found) {
                if (err) {
                    // console.log(err);
                    callback(err, null);
                } else {
                    if (_.isEmpty(found)) {
                        callback(null, "noDataFound");
                    } else {
                        var result = {};
                        result.totalSuccesCount = 0;
                        result.totalErrorCount = 0;
                        async.eachSeries(found, function (file, cb1) {
                            // console.log(value);
                            var succesCount = 0;
                            var errorCount = 0;
                            async.eachSeries(file.info[0], function (file1, cb2) {
                                console.log("--->>>>>", file1);
                                if (file1.error == null) {
                                    succesCount = _.cloneDeep(succesCount) + 1;
                                    result.totalSuccesCount++;
                                } else {
                                    console.log("I am in Error");
                                    errorCount = _.cloneDeep(errorCount) + 1;
                                    result.totalErrorCount++;
                                }
                                console.log("succesCount", succesCount);
                                console.log("errorCount", errorCount);
                                file.succesCount = succesCount;
                                file.errorCount = errorCount;
                                cb2(err, file1);
                            }, function (err) {
                                cb1(err, result);
                            });
                        }, function (err) {
                            result.found = found;
                            callback(err, result);
                        });
                    }
                }
            });
        }
    };
    module.exports = _.assign(module.exports, exports, model);