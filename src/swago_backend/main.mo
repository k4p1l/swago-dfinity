import Nat "mo:base/Nat";
import Nat64 "mo:base/Nat64";
import List "mo:base/List";
import Array "mo:base/Array";
import _Option "mo:base/Option";
import _Bool "mo:base/Bool";
import Principal "mo:base/Principal";
import Types "./Types";
import _Result "mo:base/Result";
import HashMap "mo:base/HashMap";
import Blob "mo:base/Blob";
import Time "mo:base/Time";
import _Timer "mo:base/Timer";
import Debug "mo:base/Debug";
import Iter "mo:base/Iter";
// import LedgerIndex "canister:icp_index_canister";

actor {
  stable var _transactionId: Types.TransactionId = 0;
  stable var _nfts = List.nil<Types.Nft>();
  // stable var custodians = List.nil<Principal>(); 
  type MyMintedNft = Types.MyMintedNft;
  // let null_address : Principal = Principal.fromText("aaaaa-aa");

  public type Mail_id = {
    mailId:Text;
  };

  var UserMail: [Mail_id] = [];

  public func addUsermail(mail:Mail_id): async Text {
    UserMail :=Array.append<Mail_id>(UserMail, [mail]);
    return "Registered successfully"
  };

  public shared query func getAllMails(): async [Mail_id] {
    return UserMail;
  };

  // public shared query func CheckLogin_By_Mail(user_principal:Principal): async ?Mail_id{
  //   return Array.find<Mail_id>(UserMail , func x=x.mailId == mailId);
  // };
  
  var betting_id_no: Nat64 = 0;
  public type Create_Betting = {
    user_principal:Principal;
    name :Text;
    question:Text;
    set_Time:Time.Time;
    image:Blob;
    twitter_link:Text;
    telegram_link:Text;
    website_link:Text;
    countdown_style:Nat64;
    // coin_nm:Text;
    // coin_market_sol:Float;
  };

  public type Create_Betting_data = {
    user_principal:Principal;
    name :Text;
    question:Text;
    start_time:Time.Time;
    end_time:Time.Time;
    set_Time:Time.Time;
    image:Blob;
    twitter_link:Text;
    telegram_link:Text;
    website_link:Text;
    countdown_style:Nat64;
    betting_id: Nat64;
    // coin_nm:Text;
    // coin_market_sol:Float;
  };



  var user_Betting:[Create_Betting_data] = [];

  public func add_Betting(betting :Create_Betting ):async Text {
    let current_betting_id = betting_id_no;
    let current_time = Time.now()/1_000_000_000;
    let duration = betting.set_Time/1_000_000_000;

    let new_betting = {
      user_principal=betting.user_principal;
      name = betting.name;
      question=betting.question;
      start_time = current_time;
      end_time = current_time + duration;
      set_Time=betting.set_Time;
      image=betting.image;
      twitter_link = betting.twitter_link;
      telegram_link = betting.telegram_link;
      website_link = betting.website_link;
      countdown_style = betting.countdown_style;
      betting_id = current_betting_id;
      status:Nat64 = 0;
      // coin_nm = betting.coin_nm;
      // coin_market_sol = betting.coin_market_sol;
    };
    user_Betting := Array.append<Create_Betting_data>(user_Betting , [new_betting]);
    betting_id_no := new_betting.betting_id+1;
    return "Betting Created";
  };

  public shared query func get_Betting_no(): async Nat64 {
    return betting_id_no;
  };

  public shared query func get_All_Bettings() : async [Create_Betting_data] {
    return user_Betting ;
  };

  // Add these types and functions
public type BettingPage = {
    bettings: [Create_Betting_data];
    total: Nat;
    hasMore: Bool;
};

// Modify get_All_Bettings to support pagination
public query func get_All_Bettings_Paginated(offset: Nat, limit: Nat): async BettingPage {
    let totalBettings = Array.size(user_Betting);
    let start = Nat.min(offset, totalBettings);
    let end = Nat.min(start + limit, totalBettings);
    
    var paginatedBettings: [Create_Betting_data] = [];
    
    // Get subset of bettings
    if (start < end) {
        paginatedBettings := Array.tabulate<Create_Betting_data>(
            end - start,
            func(i) = user_Betting[start + i]
        );
    };
    
    return {
        bettings = paginatedBettings;
        total = totalBettings;
        hasMore = end < totalBettings;
    };
};

  public shared query func get_My_Bettings(user_principal:Principal): async [Create_Betting] {
    return Array.filter<Create_Betting>(user_Betting ,  func x=x.user_principal == user_principal);
  };

  public shared query func get_events_by_id(betting_id:Nat64):async ?Create_Betting_data{
    return Array.find<Create_Betting_data>(user_Betting ,  func x=x.betting_id == betting_id);
  };

  public type Profile_Data = {
    principal:Principal;
    name:Text;
    display_ppicture:Blob;
    bio:Text;
  };

  var profile = HashMap.HashMap<Principal , Profile_Data>(0, Principal.equal , Principal.hash);

  public shared(msg) func set_profile(details: Profile_Data): async Text {
    Debug.print("Setting profile for provided principal: " # Principal.toText(details.principal));
    Debug.print("Caller principal: " # Principal.toText(msg.caller));
    
    // Use the provided principal from frontend
    profile.put(details.principal, details);
    Debug.print("Profile updated successfully for: " # Principal.toText(details.principal));
    return "Successfully registered";
};

 public shared query func get_profile_details(p: Principal): async ?Profile_Data {
    Debug.print("Fetching profile for principal: " # Principal.toText(p));
    let result = profile.get(p);
    switch (result) {
        case (null) { Debug.print("No profile found"); };
        case (?profile) { Debug.print("Profile found for: " # Principal.toText(p)); };
    };
    return result;
};
    
    
//   // Mint function
//   public shared func mintDip721(to: Principal, metadata: Types.MetadataDesc): async Types.MintReceipt {
//     let newId = Nat64.fromNat(List.size(nfts));
//     let nft: Types.Nft = {
//       owner = to;
//       id = newId;
//       metadata = metadata;
//     };

//     nfts := List.push(nft, nfts);
//     transactionId += 1;
//     return #Ok({
//       token_id = newId;
//       id = transactionId;
//     });
//   };

//   public shared func getNftsByPrincipal(owner: Principal): async [Types.Nft] {
//     let nftArray = List.toArray(nfts); // Convert the stable list to an array
//     let filteredArray = Array.filter(nftArray, func(nft: Types.Nft): Bool {
//         nft.owner == owner;
//     });
//     return filteredArray; // Return the filtered array
// };

//   public shared func ledgerdata(): async Nat64 {
//     let current_round = (await LedgerIndex.status()).num_blocks_synced - 1;
//     return current_round;
//   };

  public type NewToken = {
    token_Name:Text;
    token_symbol:Text;
    trader_public_key:Text;
    mint:Text;
    signature:Text;
    uri:Text;
  };
  var new_tokens:[NewToken]=[];
  public func Add_New_Tokens(details:NewToken): async Text {
    new_tokens:=Array.append<NewToken>(new_tokens , [details]);
    return "OK";
  };

  public shared query func get_token_by_symbol(token_symbol:Text) : async Text {
    var answer = Array.find<NewToken>(new_tokens , func x=x.token_symbol == token_symbol);
    switch(answer) {
      case(?found) { return found.token_Name };
      case(null) { return "null"};
    };
  };

  public func getTime() : async Time.Time{
    return Time.now()
  };

  public type yes_or_no = {
    principal:Principal;
    event_id:Nat64;
    yes_or_no:Text;
    amount:Nat64;
  };

  var yesNo_Arr:[yes_or_no] = [];
  public func Yes_or_no_fun(data: yes_or_no): async Text {
    // Check if the combination of principal and event_id already exists
    let exists = Array.find<yes_or_no>(yesNo_Arr, func x = 
        x.principal == data.principal and x.event_id == data.event_id
    );
    
    // If it exists, return a message indicating the duplicate
    if (exists != null) {
        return "you already voted";
    };
    
    // Otherwise, append the new data to the array
    yesNo_Arr := Array.append<yes_or_no>(yesNo_Arr, [data]);
    return "OK";
};

public func get_no_of_Votes(event_id: Nat64): async {yesVotes: Nat; noVotes: Nat} {
    // Filter votes matching the event_id
    let votesForEvent = Array.filter<yes_or_no>(yesNo_Arr, func(vote) = vote.event_id == event_id);

    // Count "yes" votes
    let yesVotes = Array.size(Array.filter<yes_or_no>(votesForEvent, func(vote) = vote.yes_or_no == "yes"));

    // Count "no" votes
    let noVotes = Array.size(Array.filter<yes_or_no>(votesForEvent, func(vote) = vote.yes_or_no == "no"));

    // Return the counts
    return {yesVotes; noVotes};
};


type Account = {
    prin: Principal;
    balance: Nat;
  };

  var accounts = HashMap.HashMap<Principal, Account>(0, Principal.equal, Principal.hash);
  stable var totalSupply: Nat = 0;
  // Add a function to check if an account exists
  public query func accountExists(accountId: Principal): async Bool {
      switch (accounts.get(accountId)) {
          case (?_) true;
          case null false;
      };
  };

   public shared(msg) func mint(accountId: Principal, amount: Nat): async Text {
    Debug.print("Minting tokens for principal: " # Principal.toText(accountId));
    Debug.print("Amount to mint: " # Nat.toText(amount));
    
    let account = accounts.get(accountId);
    switch (account) {
        case (?acc) {
            Debug.print("Existing account found");
            let updatedAccount = {
                prin = acc.prin;
                balance = acc.balance + amount;
            };
            accounts.put(accountId, updatedAccount);
            totalSupply += amount;
            Debug.print("Updated balance: " # Nat.toText(updatedAccount.balance));
        };
        case null {
            Debug.print("Creating new account");
            let newAccount = {
                prin = accountId;
                balance = amount;
            };
            accounts.put(accountId, newAccount);
            totalSupply += amount;
            Debug.print("New account balance: " # Nat.toText(amount));
        };
    };
    return "Tokens minted successfully";
};

  public func transfer(from: Principal, to: Principal, amount: Nat): async Text {
    let fromAccount = accounts.get(from);
      switch (fromAccount) {
        case (?acc) {
            if (acc.balance < amount) {
                return ("Insufficient balance");
            } else {
                let updatedFromAccount = {
                  prin = acc.prin;
                  balance = acc.balance - amount;
                };
                accounts.put(from, updatedFromAccount);
                let toAccount = accounts.get(to);
                switch (toAccount) {
                    case (?accTo) {
                        let updatedToAccount = {
                            prin = accTo.prin;
                            balance = accTo.balance + amount;
                        };
                        accounts.put(to, updatedToAccount);
                    };
                    case null {
                        let newToAccount = {
                            prin = to;
                            balance = amount;
                        };
                        accounts.put(to, newToAccount);
                    };
                };
              return "Transfered successfully";
            };
        };
        case null {
          return ("Sender account not found");
        };
      };
  };


  public query func balanceOf(accountId: Principal): async Nat {
    switch (accounts.get(accountId)) {
      case (?acc) acc.balance;
      case null 0;
    };
  };

  public shared query func total_Supply(): async Nat {
    totalSupply;
  };

  public query func getAllAccounts(): async [(Principal, Account)] {
    Iter.toArray(accounts.entries());
};

};