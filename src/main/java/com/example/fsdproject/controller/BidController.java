package com.example.fsdproject.controller;

import com.example.fsdproject.entity.AuctionItem;
import com.example.fsdproject.entity.Bid;
import com.example.fsdproject.entity.Sell;
import com.example.fsdproject.service.AuctionItemService;
import com.example.fsdproject.service.BidService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/bids")
public class BidController {

    private static final Logger logger = LoggerFactory.getLogger(BidController.class);

    @Autowired
    private BidService bidService;

    @Autowired
    private AuctionItemService auctionItemService;





    @CrossOrigin(origins = "${allowed.origins}")
    @GetMapping("/getbids")
    public ResponseEntity<?> getBids(@RequestParam long itemId) {
        logger.info("Received getBid request for Item: {}",itemId);

        try {
            List<Bid> bid=bidService.findByItemId(itemId);

            Map<String, Object> response = new HashMap<>();
            response.put("data", bid);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            // Handle other exceptions if needed
            Map<String, String> response = new HashMap<>();
            response.put("error", "Error during returning bid");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }


    @CrossOrigin(origins = "${allowed.origins}")
    @GetMapping("/{itemId}")
    public ResponseEntity<?> getUserByUsername(@PathVariable long itemId) {
        try {
            Optional<Bid> bid = bidService.getHighestBidByItemId(itemId);

            if (bid != null) {
                // Return the user object if found
                return ResponseEntity.ok(bid);
            } else {
                // Return a response indicating that the user was not found
                Map<String, String> response = new HashMap<>();
                response.put("error", "bid not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
        } catch (Exception e) {
            // Handle other exceptions if needed
            Map<String, String> response = new HashMap<>();
            response.put("error", "Error during user retrieval");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @CrossOrigin(origins = "${allowed.origins}")
    @GetMapping("/getSoldItemByUsername/{username}")
    public List<Sell> getSoldItemByUsername(@PathVariable String username) {
        return bidService.getSoldItemByUsername(username);
    }


}
