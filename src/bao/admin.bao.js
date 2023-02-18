const Base = require("./base");
const { v4: uuidv4 } = require("uuid");
const logger = require("../common/logger")("admin-bao");
const constants = require("../common/constants");
const nodemailer = require("nodemailer");
const moment = require("moment-timezone");
const { CryptoService } = require("../services");
const {
  AdminDao,
  UserDao,
  ClosetDao,
  OutfitDao,
  ProductsDao,
} = require("../dao");

class AdminBao extends Base {
  constructor() {
    super();
  }

  async adminLogin(emailId, password) {
    try {
      logger.info("inside adminLogin", emailId);
      const emailRegex =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      const isValidEmail = emailRegex.test(emailId);
      if (!isValidEmail) {
        return {
          statusCode: constants.STATUS_CODES[314],
          statusMessage: constants.STATUS_MESSAGE[314],
        };
      }

      let findEmailId = await AdminDao.findEmailId(emailId);
      if (findEmailId.length > 0) {
        let decryptedPassword = await CryptoService.decryptKey(
          findEmailId[0].saltKey,
          findEmailId[0].saltKeyIv,
          findEmailId[0].encryptedData
        );

        if (password === decryptedPassword) {
          return {
            statusCode: constants.STATUS_CODES[200],
            statusMessage: constants.STATUS_MESSAGE[200],
            emailId: findEmailId[0].emailId,
            userId: findEmailId[0]._id,
            role: findEmailId[0].role,
            createdOn: findEmailId[0].createdOn,
            updatedOn: findEmailId[0].updatedOn,
          };
        } else {
          return {
            statusCode: constants.STATUS_CODES[315],
            statusMessage: constants.STATUS_MESSAGE[315],
          };
        }
      } else {
        return {
          statusCode: constants.STATUS_CODES[302],
          statusMessage: constants.STATUS_MESSAGE[302],
        };
      }
    } catch (e) {
      logger.error(e);
      throw e;
    }
  }

  async forgetPassword(emailId) {
    try {
      logger.info("inside forgetPassword", emailId);
      const emailRegex =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      const isValidEmail = emailRegex.test(emailId);
      if (!isValidEmail) {
        return {
          statusCode: constants.STATUS_CODES[314],
          statusMessage: constants.STATUS_MESSAGE[314],
        };
      }

      let findEmailId = await AdminDao.findEmailId(emailId);
      if (findEmailId.length > 0) {
        const characters =
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let randomPassword = "";
        for (let i = 0; i < 7; i++) {
          randomPassword += characters.charAt(
            Math.floor(Math.random() * characters.length)
          );
        }

        let transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 587,
          secure: false,
          auth: {
            user: process.env.EMAIL_ID,
            pass: process.env.EMAIL_PASSWORD,
          },
        });
        let mailOptions = {
          from: process.env.EMAIL_ID,
          to: emailId,
          subject: "Your password was reset",
          text: `Hi there, We wanted to let you know that your admin account password was reset. Please find the generated password ${randomPassword} for login into your admin account.`,
        };
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            logger.error(error);
          } else {
            logger.info("Mail sent successfully!");
          }
        });

        let passkeyDetail = await CryptoService.encryptKey(randomPassword);
        await AdminDao.updatePasswordDetails(emailId, passkeyDetail);
        return {
          statusCode: constants.STATUS_CODES[200],
          statusMessage: "Mail sent successfully!",
        };
      } else {
        return {
          statusCode: constants.STATUS_CODES[302],
          statusMessage: constants.STATUS_MESSAGE[302],
        };
      }
    } catch (e) {
      logger.error(e);
      throw e;
    }
  }

  async changePassword(emailId, currentPassword, newPassword) {
    try {
      logger.info("inside changePassword", emailId);
      const emailRegex =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      const isValidEmail = emailRegex.test(emailId);
      if (!isValidEmail) {
        return {
          statusCode: constants.STATUS_CODES[314],
          statusMessage: constants.STATUS_MESSAGE[314],
        };
      }

      let findEmailId = await AdminDao.findEmailId(emailId);
      if (findEmailId.length > 0) {
        if (currentPassword === newPassword) {
          return {
            statusCode: constants.STATUS_CODES[317],
            statusMessage: constants.STATUS_MESSAGE[317],
          };
        }
        let decryptedPassword = await CryptoService.decryptKey(
          findEmailId[0].saltKey,
          findEmailId[0].saltKeyIv,
          findEmailId[0].encryptedData
        );

        if (currentPassword === decryptedPassword) {
          let passkeyDetail = await CryptoService.encryptKey(newPassword);
          await AdminDao.updatePasswordDetails(emailId, passkeyDetail);

          return {
            statusCode: constants.STATUS_CODES[200],
            statusMessage: "password successfully changed",
            emailId: findEmailId[0].emailId,
            userId: findEmailId[0]._id,
            role: findEmailId[0].role,
            createdOn: findEmailId[0].createdOn,
            updatedOn: findEmailId[0].updatedOn,
          };
        } else {
          return {
            statusCode: constants.STATUS_CODES[316],
            statusMessage: constants.STATUS_MESSAGE[316],
          };
        }
      } else {
        return {
          statusCode: constants.STATUS_CODES[302],
          statusMessage: constants.STATUS_MESSAGE[302],
        };
      }
    } catch (e) {
      logger.error(e);
      throw e;
    }
  }

  async adminStats(emailId) {
    try {
      logger.info("inside adminStats", emailId);
      const emailRegex =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      const isValidEmail = emailRegex.test(emailId);
      if (!isValidEmail) {
        return {
          statusCode: constants.STATUS_CODES[314],
          statusMessage: constants.STATUS_MESSAGE[314],
        };
      }

      let findEmailId = await AdminDao.findEmailId(emailId);
      if (findEmailId.length > 0) {
        if (findEmailId[0].role === "admin") {
          let appUserCount = await UserDao.getUserCount();
          let brandUserCount = await AdminDao.getBrandUserCount();

          return {
            statusCode: constants.STATUS_CODES[200],
            statusMessage: constants.STATUS_MESSAGE[200],
            appUserCount,
            brandUserCount,
          };
        } else {
          return {
            statusCode: constants.STATUS_CODES[318],
            statusMessage: constants.STATUS_MESSAGE[318],
          };
        }
      } else {
        return {
          statusCode: constants.STATUS_CODES[302],
          statusMessage: constants.STATUS_MESSAGE[302],
        };
      }
    } catch (e) {
      logger.error(e);
      throw e;
    }
  }

  async getAllUsers(emailId, page, limit) {
    try {
      logger.info("inside getAllUsers", emailId);
      const emailRegex =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      const isValidEmail = emailRegex.test(emailId);
      if (!isValidEmail) {
        return {
          statusCode: constants.STATUS_CODES[314],
          statusMessage: constants.STATUS_MESSAGE[314],
        };
      }

      let findEmailId = await AdminDao.findEmailId(emailId);
      if (findEmailId.length > 0) {
        if (findEmailId[0].role === "admin") {
          let usersList = await UserDao.getAllUsers(page, limit);
          const filteredUsers = await Promise.all(
            usersList.map(async (user) => ({
              userId: user.userId,
              emailId: user.emailId,
              name: user?.name,
              gender: user?.gender,
              profilePicUrl: user?.profilePicUrl,
              isProfileCreated: user.isProfileCreated,
              isPreferences: user.isPreferences,
              lastActive: await this.calculateActiveStatus(user.lastActive),
              createdOn: user.createdOn,
              updatedOn: user.updatedOn,
            }))
          );
          return { total: filteredUsers.length, filteredUsers };
        } else {
          return {
            statusCode: constants.STATUS_CODES[318],
            statusMessage: constants.STATUS_MESSAGE[318],
          };
        }
      } else {
        return {
          statusCode: constants.STATUS_CODES[302],
          statusMessage: constants.STATUS_MESSAGE[302],
        };
      }
    } catch (e) {
      logger.error(e);
      throw e;
    }
  }

  async addBrandUser(adminEmailId, brandEmailId, brandName) {
    try {
      logger.info("inside addBrandUser", adminEmailId);
      const emailRegex =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      const isAdminValidEmail = emailRegex.test(adminEmailId);
      const isBrandValidEmail = emailRegex.test(brandEmailId);
      if (!isAdminValidEmail) {
        return {
          statusCode: constants.STATUS_CODES[314],
          statusMessage: constants.STATUS_MESSAGE[314],
        };
      }
      if (!isBrandValidEmail) {
        return {
          statusCode: constants.STATUS_CODES[314],
          statusMessage: constants.STATUS_MESSAGE[314],
        };
      }

      let findAdminEmailId = await AdminDao.findEmailId(adminEmailId);
      let findBrandEmailId = await AdminDao.findEmailId(brandEmailId);
      if (findAdminEmailId.length > 0) {
        if (findAdminEmailId[0].role === "admin") {
          if (findBrandEmailId.length > 0) {
            return {
              statusCode: constants.STATUS_CODES[319],
              statusMessage: constants.STATUS_MESSAGE[319],
            };
          } else {
            const characters =
              "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            let randomPassword = "";
            for (let i = 0; i < 7; i++) {
              randomPassword += characters.charAt(
                Math.floor(Math.random() * characters.length)
              );
            }

            let transporter = nodemailer.createTransport({
              host: "smtp.gmail.com",
              port: 587,
              secure: false,
              auth: {
                user: process.env.EMAIL_ID,
                pass: process.env.EMAIL_PASSWORD,
              },
            });
            let mailOptions = {
              from: process.env.EMAIL_ID,
              to: brandEmailId,
              subject:
                "Invitation to Access the Admin Panel - Login credentials enclosed",
              text: `Hi there,
              We are excited to invite you to access the admin panel for our platform. Your account has been created with the following credentials:
              
              Username: ${brandEmailId}
              Password: ${randomPassword}
              
              Please visit our platform at [platform link] to log in and start using the admin panel.
              
              As a reminder, we recommend that you change your password upon first logging in for added security.
              
              If you have any trouble logging in or have any questions about the admin panel, please don't hesitate to contact us at ${process.env.EMAIL_ID}.
              
              Thank you for joining our platform,
              Team Vetir`,
            };
            transporter.sendMail(mailOptions, function (error, info) {
              if (error) {
                logger.error(error);
              } else {
                logger.info("Mail sent successfully!");
              }
            });

            let passkeyDetail = await CryptoService.encryptKey(randomPassword);

            let insertObj = {
              emailId: brandEmailId,
              name: brandName,
              saltKey: passkeyDetail.saltKey,
              saltKeyIv: passkeyDetail.saltKeyIv,
              encryptedData: passkeyDetail.encryptedData,
              isActive: true,
              role: "brand",
              createdOn: new Date().toISOString(),
              updatedOn: new Date().toISOString(),
            };

            let userData = await AdminDao.saveUserDetails(insertObj);

            return {
              statusCode: constants.STATUS_CODES[200],
              statusMessage: "Invitation Mail Sent successfully!",
              userId: userData._id,
              emailId: userData.emailId,
              brandName: userData.name,
              isActive: userData.isActive,
              role: userData.role,
              createdOn: userData.createdOn,
              updatedOn: userData.updatedOn,
            };
          }
        } else {
          return {
            statusCode: constants.STATUS_CODES[318],
            statusMessage: constants.STATUS_MESSAGE[318],
          };
        }
      } else {
        return {
          statusCode: constants.STATUS_CODES[302],
          statusMessage: "admin user not found",
        };
      }
    } catch (e) {
      logger.error(e);
      throw e;
    }
  }

  async getAllBrands(emailId, page, limit) {
    try {
      logger.info("inside getAllBrands", emailId);
      const emailRegex =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      const isValidEmail = emailRegex.test(emailId);
      if (!isValidEmail) {
        return {
          statusCode: constants.STATUS_CODES[314],
          statusMessage: constants.STATUS_MESSAGE[314],
        };
      }

      let findEmailId = await AdminDao.findEmailId(emailId);
      if (findEmailId.length > 0) {
        if (findEmailId[0].role === "admin") {
          let brandsList = await AdminDao.getAllBrands(page, limit);
          let transformedBrandsList = brandsList.map(async (brand) => {
            let productCount = await ProductsDao.getBrandProductsCount(
              brand._id
            );
            return {
              brandId: brand._id,
              emailId: brand.emailId,
              brandName: brand.name,
              isActive: brand.isActive,
              role: brand.role,
              productCount: productCount,
              createdOn: brand.createdOn,
              updatedOn: brand.updatedOn,
            };
          });
          return {
            total: (await Promise.all(transformedBrandsList)).length,
            brandsList: await Promise.all(transformedBrandsList),
          };
        } else {
          return {
            statusCode: constants.STATUS_CODES[318],
            statusMessage: constants.STATUS_MESSAGE[318],
          };
        }
      } else {
        return {
          statusCode: constants.STATUS_CODES[302],
          statusMessage: "admin user not found",
        };
      }
    } catch (e) {
      logger.error(e);
      throw e;
    }
  }

  async deleteUserAccounts(adminUserId, userIds) {
    try {
      logger.info("inside deleteUserAccounts", adminUserId);
      let findAdminDetails = await AdminDao.findAdminUserId(adminUserId);
      if (findAdminDetails.length > 0) {
        let whereObj = { userId: { $in: userIds } };
        await UserDao.deleteUserAccount(whereObj);
        await ClosetDao.deleteClosetItems(whereObj);
        return {
          statusCode: constants.STATUS_CODES[200],
          statusMessage: "User accounts deleted successfully",
        };
      } else {
        return {
          statusCode: constants.STATUS_CODES[302],
          statusMessage: "admin user not found",
        };
      }
    } catch (e) {
      logger.error(e);
      throw e;
    }
  }

  async getUserDetails(adminUserId, userId) {
    try {
      logger.info("inside getUserDetails", adminUserId);
      let findAdminDetails = await AdminDao.findAdminUserId(adminUserId);
      if (findAdminDetails.length > 0) {
        let userDetails = await UserDao.findUserId(userId);
        let res;
        if (userDetails.length > 0) {
          let outfitDetails = await OutfitDao.findOutfitByUserId(userId);
          let finalOutfitDetails = [];
          if (outfitDetails.length > 0) {
            await Promise.all(
              outfitDetails.map(async (element) => {
                let closetDetailsList = [];
                await Promise.all(
                  element.closetItemIds.map(async (element) => {
                    let closetDetails = await ClosetDao.findClosetId(element);
                    let obj = {
                      userId: closetDetails[0].userId,
                      closetItemId: closetDetails[0]._id,
                      itemImageUrl: closetDetails[0].itemImageUrl,
                      categoryId: closetDetails[0].categoryId,
                      categoryName: closetDetails[0].categoryName,
                      subCategoryId: closetDetails[0].subCategoryId,
                      subCategoryName: closetDetails[0].subCategoryName,
                      brandId: closetDetails[0].brandId,
                      brandName: closetDetails[0].brandName,
                      season: closetDetails[0].season,
                      colorCode: closetDetails[0].colorCode,
                      createdOn: closetDetails[0].createdOn,
                      updatedOn: closetDetails[0].updatedOn,
                    };
                    closetDetailsList.push(obj);
                  })
                );
                let obj = {
                  outfitId: element._id,
                  userId: element.userId,
                  closetDetailsList,
                  outfitImageType: element.outfitImageType,
                  name: element.name,
                  description: element.description,
                  seasons: element.seasons,
                  imageData: element.imageData,
                  createdDate: element.createdOn,
                  modifiedDate: element.updatedOn,
                };
                finalOutfitDetails.push(obj);
              })
            );
          }
          const closetDetails = await ClosetDao.getClosetDetails(userId);
          let data = [];
          closetDetails.map((element) => {
            let obj = {
              userId: element.userId,
              closetItemId: element._id,
              itemImageUrl: element.itemImageUrl,
              categoryId: element.categoryId,
              categoryName: element.categoryName,
              subCategoryId: element.subCategoryId,
              subCategoryName: element.subCategoryName,
              brandId: element.brandId,
              brandName: element.brandName,
              season: element.season,
              colorCode: element.colorCode,
              createdOn: element.createdOn,
              updatedOn: element.updatedOn,
            };
            data.push(obj);
          });
          res = {
            statusCode: constants.STATUS_CODES[200],
            statusMessage: constants.STATUS_MESSAGE[200],
            userId: userDetails[0].userId,
            emailId: userDetails[0].emailId,
            name: userDetails[0].name == undefined ? null : userDetails[0].name,
            gender:
              userDetails[0].gender == undefined ? null : userDetails[0].gender,
            profilePicUrl:
              userDetails[0].profilePicUrl == undefined
                ? null
                : userDetails[0].profilePicUrl,
            isProfileCreated: userDetails[0].isProfileCreated,
            createdOn: userDetails[0].createdOn,
            updatedOn: userDetails[0].updatedOn,
            outfitDetails: finalOutfitDetails,
            closetDetails: data,
          };
        } else {
          res = {
            statusCode: constants.STATUS_CODES[302],
            statusMessage: constants.STATUS_MESSAGE[302],
          };
        }
        return res;
      } else {
        return {
          statusCode: constants.STATUS_CODES[302],
          statusMessage: "admin user not found",
        };
      }
    } catch (e) {
      logger.error(e);
      throw e;
    }
  }

  async addNewUser(adminUserId, name, emailId, gender) {
    try {
      logger.info("inside addNewUser", adminUserId);
      let findAdminDetails = await AdminDao.findAdminUserId(adminUserId);
      if (findAdminDetails.length > 0) {
        const emailRegex =
          /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const isValidEmail = emailRegex.test(emailId);
        if (!isValidEmail) {
          return {
            statusCode: constants.STATUS_CODES[314],
            statusMessage: constants.STATUS_MESSAGE[314],
          };
        }
        let findEmailId = await UserDao.findUserEmailId(emailId);
        if (findEmailId.length > 0) {
          return {
            statusCode: constants.STATUS_CODES[301],
            statusMessage: constants.STATUS_MESSAGE[301],
          };
        }
        let userId = -1;
        let isProfileCreated = false;
        do {
          userId = await this.generateUserId();
        } while (userId == null);
        let insertObj = {
          userId,
          emailId,
          name,
          gender,
          isProfileCreated,
          createdOn: new Date().toISOString(),
          updatedOn: new Date().toISOString(),
        };
        await UserDao.saveUserDetails(insertObj);
        return {
          statusCode: constants.STATUS_CODES[200],
          statusMessage: constants.STATUS_MESSAGE[200],
          userId,
          emailId,
          name,
          gender,
          isProfileCreated,
          createdOn: new Date().toISOString(),
          updatedOn: new Date().toISOString(),
        };
      } else {
        return {
          statusCode: constants.STATUS_CODES[302],
          statusMessage: "admin user not found",
        };
      }
    } catch (e) {
      logger.error(e);
      throw e;
    }
  }

  async removeUserClosetItem(adminUserId, userId, closetId) {
    try {
      logger.info("inside removeUserClosetItem", adminUserId);
      let findAdminDetails = await AdminDao.findAdminUserId(adminUserId);
      if (findAdminDetails.length > 0) {
        let userDetails = await UserDao.findUserId(userId);
        if (userDetails.length > 0) {
          let closetDetails = await ClosetDao.findClosetId(closetId);
          if (closetDetails.length > 0) {
            let whereObj = {
              userId,
              _id: closetId,
            };
            await ClosetDao.deleteClosetItem(whereObj);
            await OutfitDao.removeClosetItems(whereObj);
            return {
              statusCode: constants.STATUS_CODES[200],
              statusMessage: "item deleted successfully",
            };
          } else {
            return {
              statusCode: constants.STATUS_CODES[308],
              statusMessage: constants.STATUS_MESSAGE[308],
            };
          }
        } else {
          return {
            statusCode: constants.STATUS_CODES[302],
            statusMessage: constants.STATUS_MESSAGE[302],
          };
        }
      } else {
        return {
          statusCode: constants.STATUS_CODES[302],
          statusMessage: "admin user not found",
        };
      }
    } catch (e) {
      logger.error(e);
      throw e;
    }
  }

  async removeUserOutfitItem(adminUserId, userId, outfitId) {
    try {
      logger.info("inside removeUserOutfitItem", adminUserId);
      let findAdminDetails = await AdminDao.findAdminUserId(adminUserId);
      if (findAdminDetails.length > 0) {
        let userDetails = await UserDao.findUserId(userId);
        if (userDetails.length > 0) {
          let whereObj = {
            userId,
            _id: outfitId,
          };
          let outfitData = await OutfitDao.findSameOutfits(whereObj);
          if (outfitData.length > 0) {
            await OutfitDao.deleteOutfitItem(whereObj);
            return {
              statusCode: constants.STATUS_CODES[200],
              statusMessage: "item deleted successfully",
            };
          } else {
            return {
              statusCode: constants.STATUS_CODES[308],
              statusMessage: constants.STATUS_MESSAGE[308],
            };
          }
        } else {
          return {
            statusCode: constants.STATUS_CODES[302],
            statusMessage: constants.STATUS_MESSAGE[302],
          };
        }
      } else {
        return {
          statusCode: constants.STATUS_CODES[302],
          statusMessage: "admin user not found",
        };
      }
    } catch (e) {
      logger.error(e);
      throw e;
    }
  }

  async deleteBrandAccounts(adminUserId, brandIds) {
    try {
      logger.info("inside deleteBrandAccounts", adminUserId);
      let findAdminDetails = await AdminDao.findAdminUserId(adminUserId);
      if (findAdminDetails.length > 0) {
        let whereObj = {
          _id: { $in: brandIds },
          role: "brand",
        };
        await AdminDao.deleteBrandAccount(whereObj);
        await ProductsDao.deleteProductData({ brandId: { $in: brandIds } });
        return {
          statusCode: constants.STATUS_CODES[200],
          statusMessage: "Brand account deleted successfully",
        };
      } else {
        return {
          statusCode: constants.STATUS_CODES[302],
          statusMessage: "admin user not found",
        };
      }
    } catch (e) {
      logger.error(e);
      throw e;
    }
  }

  async addProduct(data) {
    try {
      logger.info("inside addProduct", data.brandId);
      let findBrandUserId = await AdminDao.findBrandUserId(data.brandId);
      if (findBrandUserId.length > 0) {
        let insertObj = {
          brandId: data.brandId,
          productName: data.productName,
          productPrice: data.productPrice,
          productDescription: data.productDescription,
          productColor: data.productColor,
          imageUrls: data.imageUrls,
          categoryId: data.categoryId,
          categoryName: data.categoryName,
          subCategoryId: data.subCategoryId,
          subCategoryName: data.subCategoryName,
          seasons: data.seasons,
          productSizes: data.productSizes,
          productButtonLink: data.productButtonLink,
          productStatus: "Not published",
          createdOn: new Date().toISOString(),
          updatedOn: new Date().toISOString(),
        };
        let response = await ProductsDao.saveProductDetails(insertObj);
        return {
          statusCode: constants.STATUS_CODES[200],
          statusMessage: "Product added successfully",
          productDetails: {
            productId: response._id,
            productName: response.productName,
            productPrice: response.productPrice,
            productDescription: response.productDescription,
            productColor: response.productColor,
            imageUrls: response.imageUrls,
            categoryId: response.categoryId,
            categoryName: response.categoryName,
            subCategoryId: response.subCategoryId,
            subCategoryName: response.subCategoryName,
            seasons: response.seasons,
            productSizes: response.productSizes,
            productButtonLink: response.productButtonLink,
            productStatus: response.productStatus,
            createdOn: response.createdOn,
            updatedOn: response.updatedOn,
          },
        };
      } else {
        return {
          statusCode: constants.STATUS_CODES[302],
          statusMessage: "brand id not found",
        };
      }
    } catch (e) {
      logger.error(e);
      throw e;
    }
  }

  async getBrandProducts(brandId) {
    try {
      logger.info("inside getBrandProducts", brandId);
      let findBrandUserId = await AdminDao.findBrandUserId(brandId);
      if (findBrandUserId.length > 0) {
        let productsList = await ProductsDao.getProductDetails(brandId);
        return {
          statusCode: constants.STATUS_CODES[200],
          statusMessage: constants.STATUS_MESSAGE[200],
          brandId,
          brandName: findBrandUserId[0].emailId,
          productsList,
        };
      } else {
        return {
          statusCode: constants.STATUS_CODES[302],
          statusMessage: "brand id not found",
        };
      }
    } catch (e) {
      logger.error(e);
      throw e;
    }
  }

  async getAllProducts(adminUserId) {
    try {
      logger.info("inside getAllProducts", adminUserId);
      let findBrandUserId = await AdminDao.findAdminUserId(adminUserId);
      if (findBrandUserId.length > 0) {
        let productsList = await ProductsDao.getAllProductDetails();
        let productDetails = [];
        for (const val of productsList) {
          let findBrandUserId = await AdminDao.findBrandUserId(val.brandId);
          let finalObj = {
            productId: val._id,
            brandId: val.brandId,
            brandName: findBrandUserId[0].emailId,
            productName: val.productName,
            productPrice: val.productPrice,
            productDescription: val.productDescription,
            productColor: val.productColor,
            imageUrls: val.imageUrls,
            categoryId: val.categoryId,
            categoryName: val.categoryName,
            subCategoryId: val.subCategoryId,
            subCategoryName: val.subCategoryName,
            seasons: val.seasons,
            productSizes: val.productSizes,
            productButtonLink: val.productButtonLink,
            productStatus: val.productStatus,
            createdOn: val.createdOn,
            updatedOn: val.updatedOn,
          };
          productDetails.push(finalObj);
        }
        return {
          statusCode: constants.STATUS_CODES[200],
          statusMessage: constants.STATUS_MESSAGE[200],
          productDetails,
        };
      } else {
        return {
          statusCode: constants.STATUS_CODES[302],
          statusMessage: "admin user not found",
        };
      }
    } catch (e) {
      logger.error(e);
      throw e;
    }
  }

  async getproductDetails(productId) {
    try {
      logger.info("inside getproductDetails", productId);
      let productDetails = await ProductsDao.findProduct(productId);
      if (productDetails.length > 0) {
        return {
          statusCode: constants.STATUS_CODES[200],
          statusMessage: constants.STATUS_MESSAGE[200],
          productDetails: productDetails[0],
        };
      } else {
        return {
          statusCode: constants.STATUS_CODES[302],
          statusMessage: "product id not found",
        };
      }
    } catch (e) {
      logger.error(e);
      throw e;
    }
  }

  async publishProduct(brandId) {
    try {
      logger.info("inside publishProduct", brandId);
      let findBrandUserId = await AdminDao.findBrandUserId(brandId);
      if (findBrandUserId.length > 0) {
        // let productDetails = await ProductsDao.findProduct(productId);
        // if (productDetails.length > 0) {
        await ProductsDao.updateProductStatus(brandId);
        return {
          statusCode: constants.STATUS_CODES[200],
          statusMessage: "Products published successfully",
        };
        // } else {
        //   return {
        //     statusCode: constants.STATUS_CODES[302],
        //     statusMessage: "product id not found",
        //   };
        // }
      } else {
        return {
          statusCode: constants.STATUS_CODES[302],
          statusMessage: "brand id not found",
        };
      }
    } catch (e) {
      logger.error(e);
      throw e;
    }
  }

  async deleteProducts(brandId, productIds) {
    try {
      logger.info("inside deleteProducts", brandId);
      let findBrandUserId = await AdminDao.findBrandUserId(brandId);
      if (findBrandUserId.length > 0) {
        await ProductsDao.deleteProductData({ _id: { $in: productIds } });
        return {
          statusCode: constants.STATUS_CODES[200],
          statusMessage: "products deleted successfully",
        };
      } else {
        return {
          statusCode: constants.STATUS_CODES[302],
          statusMessage: "brand id not found",
        };
      }
    } catch (e) {
      logger.error(e);
      throw e;
    }
  }

  async updateProduct(data) {
    try {
      logger.info("inside updateProduct", data.brandId);
      let findBrandUserId = await AdminDao.findBrandUserId(data.brandId);
      if (findBrandUserId.length > 0) {
        let productDetails = await ProductsDao.findProduct(data.productId);
        if (productDetails.length > 0) {
          let updateObj = {
            $set: {
              productName: data.productName,
              productPrice: data.productPrice,
              productDescription: data.productDescription,
              productColor: data.productColor,
              imageUrls: data.imageUrls,
              categoryId: data.categoryId,
              categoryName: data.categoryName,
              subCategoryId: data.subCategoryId,
              subCategoryName: data.subCategoryName,
              seasons: data.seasons,
              productSizes: data.productSizes,
              productButtonLink: data.productButtonLink,
              updatedOn: new Date().toISOString(),
            },
          };
          await ProductsDao.updateProductDetails(data.productId, updateObj);
          let productDetails = await ProductsDao.findProduct(data.productId);
          let response = productDetails[0];
          return {
            statusCode: constants.STATUS_CODES[200],
            statusMessage: constants.STATUS_MESSAGE[200],
            productDetails: {
              productId: response._id,
              productName: response.productName,
              productPrice: response.productPrice,
              productDescription: response.productDescription,
              productColor: response.productColor,
              imageUrls: response.imageUrls,
              categoryId: response.categoryId,
              categoryName: response.categoryName,
              subCategoryId: response.subCategoryId,
              subCategoryName: response.subCategoryName,
              seasons: response.seasons,
              productSizes: response.productSizes,
              productButtonLink: response.productButtonLink,
              productStatus: response.productStatus,
              createdOn: response.createdOn,
              updatedOn: response.updatedOn,
            },
          };
        } else {
          return {
            statusCode: constants.STATUS_CODES[302],
            statusMessage: "product id not found",
          };
        }
      } else {
        return {
          statusCode: constants.STATUS_CODES[302],
          statusMessage: "brand id not found",
        };
      }
    } catch (e) {
      console.log(e);
      // logger.error(e);
      throw e;
    }
  }

  async generateUserId() {
    let userId = uuidv4();
    let userExist = await UserDao.findUserId(userId);
    if (userExist.length == 0) {
      return userId;
    } else {
      return null;
    }
  }

  async calculateActiveStatus(lastActiveTime) {
    const lastActive = moment(lastActiveTime);
    const utcNow = moment.utc();
    const diffSeconds = utcNow.diff(lastActive, "seconds");

    let displayString = "";
    if (diffSeconds < 60) {
      displayString = "active " + diffSeconds + " seconds ago";
    } else if (diffSeconds < 3600) {
      const diffMinutes = Math.floor(diffSeconds / 60);
      displayString =
        "active " +
        diffMinutes +
        " minute" +
        (diffMinutes > 1 ? "s" : "") +
        " ago";
    } else if (diffSeconds < 86400) {
      const diffHours = Math.floor(diffSeconds / 3600);
      displayString =
        "active " + diffHours + " hour" + (diffHours > 1 ? "s" : "") + " ago";
    } else {
      const diffDays = Math.floor(diffSeconds / 86400);
      displayString =
        "active " + diffDays + " day" + (diffDays > 1 ? "s" : "") + " ago";
    }

    return displayString;
  }
}

module.exports = AdminBao;
