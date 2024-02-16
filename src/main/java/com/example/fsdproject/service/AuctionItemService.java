package com.example.fsdproject.service;

import com.example.fsdproject.entity.AuctionItem;
import com.example.fsdproject.entity.User;
import com.example.fsdproject.repository.AuctionItemRepository;
import com.example.fsdproject.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AuctionItemService {

    @Autowired
    private AuctionItemRepository auctionItemRepository;

    public List<AuctionItem> findAllItems()
    {
        return auctionItemRepository.findAll();
    }

    public AuctionItem saveAuctionItem(AuctionItem auctionItem) {
        return auctionItemRepository.save(auctionItem);
    }

    public List<AuctionItem> findByUserId(Long userId) {
        return auctionItemRepository.findByUser_Id(userId);
    }

    public Optional<AuctionItem> findAuctionItemById(Long itemId) {
        return auctionItemRepository.findById(itemId);
    }

    public void updateCurrentBid(Long itemId, double newBidAmount) {
        Optional<AuctionItem> optionalAuctionItem = auctionItemRepository.findById(itemId);

        if (optionalAuctionItem.isPresent()) {
            AuctionItem auctionItem = optionalAuctionItem.get();
            auctionItem.setCurrentBid(newBidAmount);
            auctionItemRepository.save(auctionItem);
        } else {
            // Handle the case where the item with the given ID is not found
            throw new IllegalArgumentException("AuctionItem with ID " + itemId + " not found");
        }
    }

    public List<AuctionItem> findItemsNotOwnedByUser(User user) {
        // Implement logic to retrieve items not owned by the specified user
        // You can use your repository or directly query the database
        // Here, I assume you have a method like 'findAllByUserNot' in your repository
        return auctionItemRepository.findAllByUserNot(user);
    }

}


