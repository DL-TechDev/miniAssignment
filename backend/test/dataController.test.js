const Data = require("../models/data"); // Import the Data model
const { uploadData, getData, findData } = require("../controllers/dataController");

// Mock the Data model
jest.mock('../models/data');

describe('Data Controller', () => {
  
  afterEach(() => {
    jest.clearAllMocks(); // Clear any mocks after each test
  });

  describe("uploadData", () => {
    it("should clear previous data and upload new data successfully", async () => {
      const req = {
        body: [
          { postId: 1, id: 1, name: "John Doe", email: "john@example.com", body: "Sample body 1" },
          { postId: 2, id: 2, name: "Jane Doe", email: "jane@example.com", body: "Sample body 2" },
        ],
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
        json: jest.fn(),
      };

      Data.deleteMany.mockResolvedValue({});
      Data.insertMany.mockResolvedValue(req.body);

      await uploadData(req, res);

      expect(Data.deleteMany).toHaveBeenCalledTimes(1); // Ensure old data is cleared
      expect(Data.insertMany).toHaveBeenCalledWith(req.body); // Ensure new data is inserted
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith("Data uploaded successfully");
    });

    it("should return a 400 status if records are not an array", async () => {
      const req = { body: "Not an array" };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await uploadData(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Expected an array of records" });
    });

    it("should return a 400 status if an error occurs while uploading data", async () => {
      const req = {
        body: [{ postId: 1, id: 1, name: "John Doe", email: "john@example.com", body: "Sample body 1" }],
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      Data.deleteMany.mockRejectedValue(new Error("Error clearing data"));

      await uploadData(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Error clearing data" });
    });
  });
    
    describe("getData", () => {
      it("should fetch paginated data successfully", async () => {
        const req = { body: { page: 1, limit: 10 } };
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
        const records = [
          { postId: 1, id: 1, name: "Hans", email: "hans@email.com", body: "Description here" },
          { postId: 2, id: 2, name: "Kelvin", email: "kelvin@email.com", body: "Another description here" },
        ];

        // Mock the chained methods: find, skip, limit
        Data.find.mockImplementation(() => ({
          skip: jest.fn().mockReturnThis(),
          limit: jest.fn().mockResolvedValue(records),
        }));
        Data.countDocuments.mockResolvedValue(2);

        // Call the controller function
        await getData(req, res);

        expect(Data.find).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
          records,
          page: 1,
          totalPages: 1,
        });
      });

      it("it should return 500 if there is error fetching data", async () => {
        const req = { body: { page: 1, limit: 10 } };
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };

        // Directly mock Data.find to return a rejected promise
        Data.find.mockImplementation(() => {
          throw new Error("Error fetching data");
        });

        await getData(req, res);

        // Ensure status 500 is returned
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: "Error fetching data" });
      });
    });
});