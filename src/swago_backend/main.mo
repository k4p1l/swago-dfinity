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
import Hash "mo:base/Hash";
import Float "mo:base/Float";
import Error "mo:base/Error";
import Int "mo:base/Int";
// import LedgerIndex "canister:icp_index_canister";

actor {
  // House wallet principal that holds and distributes funds
  let HOUSE_WALLET : Principal = Principal.fromText("elieq-ev22i-d7yya-vgih3-bdohe-bj5qc-aoc55-rd4or-nuvef-rqhsz-mqe");
  stable var _transactionId : Types.TransactionId = 0;
  stable var _nfts = List.nil<Types.Nft>();
  // stable var custodians = List.nil<Principal>();
  type MyMintedNft = Types.MyMintedNft;
  // let null_address : Principal = Principal.fromText("aaaaa-aa");

  public type Mail_id = {
    mailId : Text;
  };

  var UserMail : [Mail_id] = [];

  public func addUsermail(mail : Mail_id) : async Text {
    UserMail := Array.append<Mail_id>(UserMail, [mail]);
    return "Registered successfully";
  };

  public shared query func getAllMails() : async [Mail_id] {
    return UserMail;
  };

  // public shared query func CheckLogin_By_Mail(user_principal:Principal): async ?Mail_id{
  //   return Array.find<Mail_id>(UserMail , func x=x.mailId == mailId);
  // };

  var betting_id_no : Nat64 = 1;
  public type Create_Betting = {
    user_principal : Principal;
    question : Text;
    set_Time : Time.Time;
    image : Text;
    twitter_link : Text;
    telegram_link : Text;
    website_link : Text;
    countdown_style : Nat64;
    coin_nm : Text;
    coin_mint : Text;
    coin_market_sol : Float; //target market cap
    initial_market_sol : Float;
    direction : Text;
  };

  public type Create_Betting_data = {
    user_principal : Principal;
    question : Text;
    start_time : Time.Time;
    end_time : Time.Time;
    set_Time : Time.Time;
    image : Text;
    twitter_link : Text;
    telegram_link : Text;
    website_link : Text;
    countdown_style : Nat64;
    status : Nat;
    betting_id : Nat64;
    coin_nm : Text;
    coin_mint : Text;
    coin_market_sol : Float;
    initial_market_sol : Float;
    direction : Text;
  };

  var user_Betting : [Create_Betting_data] = [];

  public func add_Betting(betting : Create_Betting) : async Text {
    let current_betting_id = betting_id_no;
    let current_time = Time.now() / 1_000_000_000;
    let duration = betting.set_Time / 1_000_000_000;

    let new_betting = {
      user_principal = betting.user_principal;
      question = betting.question;
      start_time = current_time;
      end_time = current_time + duration;
      set_Time = betting.set_Time;
      image = betting.image;
      twitter_link = betting.twitter_link;
      telegram_link = betting.telegram_link;
      website_link = betting.website_link;
      countdown_style = betting.countdown_style;
      betting_id = current_betting_id;
      status = 1;
      coin_nm = betting.coin_nm;
      coin_mint = betting.coin_mint;
      coin_market_sol = betting.coin_market_sol;
      initial_market_sol = betting.initial_market_sol;
      direction = betting.direction;
    };
    user_Betting := Array.append<Create_Betting_data>(user_Betting, [new_betting]);
    betting_id_no := new_betting.betting_id + 1;
    let initialSnapshot : VoteSnapshot = {
      timestamp = Time.now();
      yesPercentage = 0.0;
      noPercentage = 0.0;
      totalVotes = 0;
      yesAmount = 0;
      noAmount = 0;
      totalAmount = 0;
    };
    voteHistory.put(current_betting_id, [initialSnapshot]);
    return "Betting Created";
  };

  public shared query func unresolved_events() : async [Create_Betting_data] {
    return Array.filter<Create_Betting_data>(user_Betting, func(event) = event.status == 1);
  };

  public shared query func get_Betting_no() : async Nat64 {
    return betting_id_no;
  };

  public shared query func get_All_Bettings() : async [Create_Betting_data] {
    return user_Betting;
  };

  // Add these types and functions
  public type BettingPage = {
    bettings : [Create_Betting_data];
    total : Nat;
    hasMore : Bool;
  };

  // Modify get_All_Bettings to support pagination
  public query func get_All_Bettings_Paginated(offset : Nat, limit : Nat) : async BettingPage {
    let totalBettings = Array.size(user_Betting);
    let start = Nat.min(offset, totalBettings);
    let end = Nat.min(start + limit, totalBettings);

    var paginatedBettings : [Create_Betting_data] = [];

    // Get subset of bettings
    if (start < end) {
      paginatedBettings := Array.tabulate<Create_Betting_data>(
        end - start,
        func(i) = user_Betting[start + i],
      );
    };

    return {
      bettings = paginatedBettings;
      total = totalBettings;
      hasMore = end < totalBettings;
    };
  };

  public shared query func get_My_Bettings(user_principal : Principal) : async [Create_Betting] {
    return Array.filter<Create_Betting>(user_Betting, func x = x.user_principal == user_principal);
  };

  public shared query func get_events_by_id(betting_id : Nat64) : async ?Create_Betting_data {
    return Array.find<Create_Betting_data>(user_Betting, func x = x.betting_id == betting_id);
  };

  public type Profile_Data = {
    principal : Principal;
    name : Text;
    display_ppicture : Blob;
    bio : Text;
  };

  var profile = HashMap.HashMap<Principal, Profile_Data>(0, Principal.equal, Principal.hash);

  public shared (msg) func set_profile(details : Profile_Data) : async Text {
    Debug.print("Setting profile for provided principal: " # Principal.toText(details.principal));
    Debug.print("Caller principal: " # Principal.toText(msg.caller));

    // Use the provided principal from frontend
    profile.put(details.principal, details);
    Debug.print("Profile updated successfully for: " # Principal.toText(details.principal));
    return "Successfully registered";
  };

  public shared query func get_profile_details(p : Principal) : async ?Profile_Data {
    Debug.print("Fetching profile for principal: " # Principal.toText(p));
    let result = profile.get(p);
    switch (result) {
      case (null) { Debug.print("No profile found") };
      case (?profile) {
        Debug.print("Profile found for: " # Principal.toText(p));
      };
    };
    return result;
  };
  public type NewToken = {
    token_Name : Text;
    token_symbol : Text;
    trader_public_key : Text;
    mint : Text;
    signature : Text;
    uri : Text;
  };
  var new_tokens : [NewToken] = [];
  public func Add_New_Tokens(details : NewToken) : async Text {
    new_tokens := Array.append<NewToken>(new_tokens, [details]);
    return "OK";
  };

  public shared query func get_token_by_symbol(token_symbol : Text) : async Text {
    var answer = Array.find<NewToken>(new_tokens, func x = x.token_symbol == token_symbol);
    switch (answer) {
      case (?found) { return found.token_Name };
      case (null) { return "null" };
    };
  };

  public func getTime() : async Time.Time {
    return Time.now();
  };

  public type yes_or_no = {
    principal : Principal;
    event_id : Nat64;
    yes_or_no : Text;
    amount : Nat64;
  };

  // Add this helper function for Nat64 hashing
  private func nat64Hash(n : Nat64) : Hash.Hash {
    Hash.hash(Nat64.toNat(n));
  };

  public type VoteSnapshot = {
    timestamp : Int; // Unix timestamp in seconds
    yesPercentage : Float;
    noPercentage : Float;
    totalVotes : Nat;
    yesAmount : Nat;
    noAmount : Nat;
    totalAmount : Nat;
  };

  var voteHistory = HashMap.HashMap<Nat64, [VoteSnapshot]>(0, Nat64.equal, nat64Hash);

  var yesNo_Arr : [yes_or_no] = [];
  public func Yes_or_no_fun(data : yes_or_no) : async Text {
    // Check if the combination of principal and event_id already exists
    // let exists = Array.find<yes_or_no>(
    //   yesNo_Arr,
    //   func x = x.principal == data.principal and x.event_id == data.event_id,
    // );

    // // If it exists, return a message indicating the duplicate
    // if (exists != null) {
    //   return "you already voted";
    // };

    // Otherwise, append the new data to the array
    yesNo_Arr := Array.append<yes_or_no>(yesNo_Arr, [data]);

    let currentVotes = await get_no_of_Votes(data.event_id);

    let totalVotes = currentVotes.yesVotes + currentVotes.noVotes;
    let yesPercentage = if (totalVotes == 0) 0.0 else Float.fromInt(currentVotes.yesVotes) / Float.fromInt(totalVotes) * 100.0;
    let noPercentage = if (totalVotes == 0) 0.0 else Float.fromInt(currentVotes.noVotes) / Float.fromInt(totalVotes) * 100.0;
    let snapshot : VoteSnapshot = {
      timestamp = Time.now();
      yesPercentage = yesPercentage;
      noPercentage = noPercentage;
      totalVotes = totalVotes;
      yesAmount = Nat64.toNat(currentVotes.yesAmount);
      noAmount = Nat64.toNat(currentVotes.noAmount);
      totalAmount = currentVotes.yesVotes + currentVotes.noVotes;
    };

    switch (voteHistory.get(data.event_id)) {
      case null {
        voteHistory.put(data.event_id, [snapshot]);
      };
      case (?existing) {
        voteHistory.put(data.event_id, Array.append(existing, [snapshot]));
      };
    };
    return "OK";
  };

  public query func getVoteHistory(event_id : Nat64) : async [VoteSnapshot] {
    switch (voteHistory.get(event_id)) {
      case null { return [] };
      case (?history) { return history };
    };
  };

  public func get_no_of_Votes(event_id : Nat64) : async {
    yesVotes : Nat;
    noVotes : Nat;
    yesAmount : Nat64;
    noAmount : Nat64;
  } {
    // Filter votes matching the event_id
    let votesForEvent = Array.filter<yes_or_no>(yesNo_Arr, func(vote) = vote.event_id == event_id);

    // Get yes votes and amounts
    let yesVotes = Array.filter<yes_or_no>(votesForEvent, func(vote) = vote.yes_or_no == "yes");
    let yesAmount = Array.foldLeft<yes_or_no, Nat64>(
      yesVotes,
      0,
      func(acc, vote) = acc + vote.amount,
    );

    // Get no votes and amounts
    let noVotes = Array.filter<yes_or_no>(votesForEvent, func(vote) = vote.yes_or_no == "no");
    let noAmount = Array.foldLeft<yes_or_no, Nat64>(
      noVotes,
      0,
      func(acc, vote) = acc + vote.amount,
    );

    // Return both counts and amounts
    return {
      yesVotes = yesVotes.size();
      noVotes = noVotes.size();
      yesAmount = yesAmount;
      noAmount = noAmount;
    };
  };

  type Account = {
    prin : Principal;
    balance : Nat;
  };

  var accounts = HashMap.HashMap<Principal, Account>(0, Principal.equal, Principal.hash);
  stable var totalSupply : Nat = 0;
  // Add a function to check if an account exists
  public query func accountExists(accountId : Principal) : async Bool {
    switch (accounts.get(accountId)) {
      case (?_) true;
      case null false;
    };
  };

  public shared (msg) func mint(accountId : Principal, amount : Nat) : async Text {
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

  public type transaction_history = {
    t_from : Principal;
    t_to : Principal;
    t_amount : Nat;
    t_time : Time.Time;
  };

  var trans_history : [transaction_history] = [];

  public func transfer(from : Principal, to : Principal, amount : Nat) : async Text {
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

          let trans_data = {
            t_from = from;
            t_to = to;
            t_amount = amount;
            t_time = Time.now();
          };
          trans_history := Array.append<transaction_history>(trans_history, [trans_data]);

          return "Transfered successfully";
        };
      };
      case null {
        return ("Sender account not found");
      };
    };
  };

  public query func balanceOf(accountId : Principal) : async Nat {
    switch (accounts.get(accountId)) {
      case (?acc) acc.balance;
      case null 0;
    };
  };

  public shared query func total_Supply() : async Nat {
    totalSupply;
  };

  public query func getAllAccounts() : async [(Principal, Account)] {
    Iter.toArray(accounts.entries());
  };

  public type ResultRet = {
    #err : Text;
    #Time;
    #ok : Time.Time;
    #OK : Text;
    #index : Nat64;
  };

  public type BetInfo = {
    principal : Principal;
    amount : Nat64;
    choice : Text; // "yes" or "no"
    event_id : Nat64;
  };

  public type PayoutInfo = {
    total_pool : Nat64;
    winning_pool : Nat64;
    platform_fee : Nat64;
    creator_reward : Nat64;
    remaining_pool : Nat64;
    winning_choice : Text;
    current_market_cap : Float;
    target_market_cap : Float;
  };

  public type UserBetResult = {
    principal : Principal;
    bet_amount : Nat64;
    choice : Text;
    won : Bool;
    payout_amount : Nat64;
  };

  public func getUserBetResult(event_id : Nat64, user_principal : Principal) : async ?UserBetResult {
    let bets = Array.filter<yes_or_no>(
      yesNo_Arr,
      func(bet) = bet.event_id == event_id and bet.principal == user_principal,
    );

    if (bets.size() == 0) {
      return null;
    };

    let bet = bets[0];
    let event = await get_events_by_id(event_id);

    switch (event) {
      case (null) { return null };
      case (?event_data) {
        let payout_info = await calculatePayout(event_id, event_data.coin_market_sol);
        let won = bet.yes_or_no == payout_info.winning_choice;

        let payout_amount = if (won) {
          let proportion = Float.fromInt(Nat64.toNat(bet.amount)) / Float.fromInt(Nat64.toNat(payout_info.winning_pool));
          Nat64.fromNat(
            Int.abs(
              Float.toInt(
                proportion * Float.fromInt(Nat64.toNat(payout_info.remaining_pool))
              )
            )
          );
        } else {
          0 : Nat64;
        };

        return ?{
          principal = user_principal;
          bet_amount = bet.amount;
          choice = bet.yes_or_no;
          won = won;
          payout_amount = payout_amount;
        };
      };
    };
  };

  public func getBetsForEvent(event_id : Nat64) : async [BetInfo] {
    // Filter votes for this event and convert to BetInfo
    Array.map<yes_or_no, BetInfo>(
      Array.filter<yes_or_no>(yesNo_Arr, func(vote) = vote.event_id == event_id),
      func(vote) = {
        principal = vote.principal;
        amount = vote.amount;
        choice = vote.yes_or_no;
        event_id = vote.event_id;
      },
    );
  };

  public func updateEventStatus(betting_id : Nat64, newStatus : Nat) : async Bool {
    // Find the event index
    var eventIndex : Nat = 0;
    var found : Bool = false;

    for (i in Iter.range(0, user_Betting.size() - 1)) {
      if (user_Betting[i].betting_id == betting_id) {
        eventIndex := i;
        found := true;
      };
    };

    if (not found) {
      return false;
    };

    // Create updated event with new status
    let updatedEvent = {
      user_principal = user_Betting[eventIndex].user_principal;
      question = user_Betting[eventIndex].question;
      start_time = user_Betting[eventIndex].start_time;
      end_time = user_Betting[eventIndex].end_time;
      set_Time = user_Betting[eventIndex].set_Time;
      image = user_Betting[eventIndex].image;
      twitter_link = user_Betting[eventIndex].twitter_link;
      telegram_link = user_Betting[eventIndex].telegram_link;
      website_link = user_Betting[eventIndex].website_link;
      countdown_style = user_Betting[eventIndex].countdown_style;
      betting_id = user_Betting[eventIndex].betting_id;
      status = newStatus;
      coin_nm = user_Betting[eventIndex].coin_nm;
      coin_mint = user_Betting[eventIndex].coin_mint;
      coin_market_sol = user_Betting[eventIndex].coin_market_sol;
      initial_market_sol = user_Betting[eventIndex].initial_market_sol;
      direction = user_Betting[eventIndex].direction;
    };

    // Create new array with updated event
    let newBettings = Array.tabulate<Create_Betting_data>(
      user_Betting.size(),
      func(i) = if (i == eventIndex) updatedEvent else user_Betting[i],
    );

    // Update the user_Betting array
    user_Betting := newBettings;

    return true;
  };

  public func calculatePayout(event_id : Nat64, current_market_cap : Float) : async PayoutInfo {
    Debug.print("Calculating payout for event: " # debug_show (event_id));
    let bets = await getBetsForEvent(event_id);
    Debug.print("Total bets found: " # debug_show (bets.size()));

    // Calculate total pool
    let total_pool = Array.foldLeft<BetInfo, Nat64>(
      bets,
      0,
      func(acc, bet) = acc + bet.amount,
    );
    Debug.print("Total pool: " # debug_show (total_pool));

    // Get event details to determine winning choice
    Debug.print("Fetching event details...");
    let event = await get_events_by_id(event_id);
    switch (event) {
      case (null) {
        Debug.print("Event not found!");
        throw Error.reject("Event not found");
      };
      case (?event_data) {
        Debug.print("Target market cap: " # debug_show (event_data.coin_market_sol));
        Debug.print("Current market cap: " # debug_show (current_market_cap));

        let winning_choice = switch (event_data.direction) {
          case ("increase") {
            // If question was about increasing, check if current is higher
            if (current_market_cap >= event_data.coin_market_sol) "yes" else "no";
          };
          case ("decrease") {
            // If question was about decreasing, check if current is lower
            if (current_market_cap <= event_data.coin_market_sol) "yes" else "no";
          };
          case (_) {
            throw Error.reject("Invalid direction specified");
          };
        };

        // Calculate winning pool
        let winning_pool = Array.foldLeft<BetInfo, Nat64>(
          Array.filter<BetInfo>(bets, func(bet) = bet.choice == winning_choice),
          0,
          func(acc, bet) = acc + bet.amount,
        );
        Debug.print("Winning pool: " # debug_show (winning_pool));

        // Calculate fees
        let platform_fee = total_pool * 1 / 100;
        let creator_reward = total_pool * 5 / 1000;
        let remaining_pool = total_pool - platform_fee - creator_reward;

        Debug.print("Platform fee: " # debug_show (platform_fee));
        Debug.print("Creator reward: " # debug_show (creator_reward));
        Debug.print("Remaining pool: " # debug_show (remaining_pool));

        return {
          total_pool = total_pool;
          winning_pool = winning_pool;
          platform_fee = platform_fee;
          creator_reward = creator_reward;
          remaining_pool = remaining_pool;
          winning_choice = winning_choice;
          current_market_cap = current_market_cap;
          target_market_cap = event_data.coin_market_sol;
        };
      };
    };
  };

  public func distributeRewards(event_id : Nat64, current_market_cap : Float) : async [ResultRet] {
    Debug.print("Starting distribution for event: " # debug_show (event_id));
    var results : [ResultRet] = [];

    try {
      Debug.print("Fetching event details...");
      let event = switch (await get_events_by_id(event_id)) {
        case (null) {
          Debug.print("Event not found!");
          throw Error.reject("Event not found");
        };
        case (?e) {
          Debug.print("Event found: " # debug_show (e.coin_nm));
          e;
        };
      };

      Debug.print("Checking if event has ended...");
      Debug.print("Current time: " # debug_show (Time.now()));
      Debug.print("Event end time: " # debug_show (event.end_time));

      // Ensure event has ended
      if (Time.now() < event.end_time) {
        Debug.print("Event hasn't ended yet!");
        throw Error.reject("Event hasn't ended yet");
      };
      Debug.print("Calculating payouts...");
      let payout_info = await calculatePayout(event_id, current_market_cap);

      Debug.print("Payout info: " # debug_show (payout_info));

      Debug.print("Fetching bets...");
      let bets = await getBetsForEvent(event_id);
      Debug.print("Total bets found: " # debug_show (bets.size()));

      // Filter winning bets
      let winning_bets = Array.filter<BetInfo>(
        bets,
        func(bet) = bet.choice == payout_info.winning_choice,
      );

      // Special case: if all bets are on one side
      if (payout_info.winning_pool == 0) {
        // Return everyone's money minus platform fee
        for (bet in bets.vals()) {
          let refund_amount = Nat64.toNat(bet.amount * 99 / 100); // Minus 1% platform fee
          let result = await transfer(
            HOUSE_WALLET,
            bet.principal,
            refund_amount,
          );
          results := Array.append(results, [#OK(result)]);
        };
      } else {
        Debug.print("Processing normal distribution...");
        // Normal case: distribute winnings
        for (bet in winning_bets.vals()) {
          let proportion = Float.fromInt(Nat64.toNat(bet.amount)) / Float.fromInt(Nat64.toNat(payout_info.winning_pool));
          let reward = Int.abs(
            Float.toInt(
              proportion * Float.fromInt(Nat64.toNat(payout_info.remaining_pool))
            )
          );

          let result = await transfer(
            HOUSE_WALLET,
            bet.principal,
            reward,
          );
          Debug.print("Transfer result: " # debug_show (result));
          results := Array.append(results, [#OK(result)]);
        };

        // Pay creator reward
        Debug.print("Processing creator reward...");
        Debug.print("Creator principal: " # Principal.toText(event.user_principal));
        Debug.print("Creator reward amount: " # debug_show (payout_info.creator_reward));
        let result = await transfer(
          HOUSE_WALLET,
          event.user_principal,
          Nat64.toNat(payout_info.creator_reward),
        );
        Debug.print("Creator reward transfer result: " # debug_show (result));
        results := Array.append(results, [#OK("Creator reward paid")]);
      };
      Debug.print("Updating event status...");
      // Update event status
      let event_update = await updateEventStatus(event_id, 0); // 0 = resolved
      Debug.print("Event status update result: " # debug_show (event_update));
      if (not event_update) {
        Debug.print("Failed to update event status!");
        throw Error.reject("Failed to update event status");
      };
      Debug.print("Distribution completed successfully!");
    } catch (e) {
      Debug.print("Error during distribution: " # Error.message(e));
      results := Array.append(results, [#err(Error.message(e))]);
    };

    return results;
  };

  // Add a function to get event statistics
  public query func getEventStats(event_id : Nat64) : async {
    total_bets : Nat;
    total_amount : Nat64;
    yes_bets : Nat;
    no_bets : Nat;
    yes_amount : Nat64;
    no_amount : Nat64;
  } {
    let bets = Array.filter<yes_or_no>(yesNo_Arr, func(vote) = vote.event_id == event_id);
    let yes_bets = Array.filter<yes_or_no>(bets, func(vote) = vote.yes_or_no == "yes");
    let no_bets = Array.filter<yes_or_no>(bets, func(vote) = vote.yes_or_no == "no");

    {
      total_bets = bets.size();
      total_amount = Array.foldLeft<yes_or_no, Nat64>(bets, 0, func(acc, bet) = acc + bet.amount);
      yes_bets = yes_bets.size();
      no_bets = no_bets.size();
      yes_amount = Array.foldLeft<yes_or_no, Nat64>(yes_bets, 0, func(acc, bet) = acc + bet.amount);
      no_amount = Array.foldLeft<yes_or_no, Nat64>(no_bets, 0, func(acc, bet) = acc + bet.amount);
    };
  };

  public shared query func get_User_Principal(betting_id : Nat64) : async ?Principal {
    let result = Array.find<Create_Betting_data>(user_Betting, func x = x.betting_id == betting_id);
    return switch (result) {
      case (?bet) ?bet.user_principal;
      case null null;
    };
  };

  public func resolve_event(
    from_prin : Principal,
    betting_id : Nat64,
    won_amount : Nat,
    prin : Principal,
    current_coin_marketsol : Float,
    increase_or_decrease : Text,
  ) : async ResultRet {
    var ans = await get_events_by_id(betting_id);
    switch (ans) {
      case (?data) {
        if (data.set_Time >= Time.now()) {
          Debug.print(debug_show ("Ready to resolve"));

          let creator_principal_opt = await get_User_Principal(betting_id);
          switch (creator_principal_opt) {
            case (?creator_principal) {
              let platform_share = (won_amount * 1) / 100;
              let creator_share = (won_amount * 5) / 10000;
              let winner_share = won_amount - (platform_share + creator_share);

              if (increase_or_decrease == "increase") {
                if (current_coin_marketsol > data.coin_market_sol) {
                  let platform_transfer = await transfer(from_prin, from_prin, platform_share);
                  let creator_transfer = await transfer(from_prin, creator_principal, creator_share);
                  let winner_transfer = await transfer(from_prin, prin, winner_share);

                  Debug.print(debug_show (platform_transfer));
                  Debug.print(debug_show (creator_transfer));
                  Debug.print(debug_show (winner_transfer));

                  let event_update = await updateEventStatus(betting_id, 0); // 0 = resolved
                  Debug.print("Event status update result: " # debug_show (event_update));
                  return #OK("Completed");
                } else {
                  return #err("Market sol did not increase as expected.");
                };
              } else if (increase_or_decrease == "decrease") {
                if (current_coin_marketsol < data.coin_market_sol) {
                  let platform_transfer = await transfer(from_prin, from_prin, platform_share);
                  let creator_transfer = await transfer(from_prin, creator_principal, creator_share);
                  let winner_transfer = await transfer(from_prin, prin, winner_share);

                  Debug.print(debug_show (platform_transfer));
                  Debug.print(debug_show (creator_transfer));
                  Debug.print(debug_show (winner_transfer));

                  let event_update = await updateEventStatus(betting_id, 0); // 0 = resolved
                  Debug.print("Event status update result: " # debug_show (event_update));
                  return #OK("Completed");
                } else {
                  return #err("Market sol did not decrease as expected.");
                };
              } else {
                return #err("Invalid value for increase_or_decrease.");
              };
            };
            case (null) {
              return #err("Creator principal not found.");
            };
          };
        } else {
          return #err("Event resolution time has passed.");
        };
      };
      case (null) {
        return #err("Event with the specified ID not found.");
      };
    };
  };

  public shared query func get_Latest_Bettings(limit : Nat) : async [Create_Betting_data] {
    let allBettings = Iter.toArray(user_Betting.vals());
    let total = allBettings.size();

    if (limit >= total) {
      return allBettings;
    } else {
      return Array.tabulate<Create_Betting_data>(
        limit,
        func(i) { allBettings[total - limit + i] },
      );
    };
  };

  public func get_by_event_id(event_id : Nat64) : async ?(Principal, Nat64) {
    let filtered = Array.filter<yes_or_no>(yesNo_Arr, func x = x.event_id == event_id);
    if (filtered.size() == 0) {
      return null;
    } else {
      return ?(filtered[filtered.size() - 1].principal, filtered[filtered.size() - 1].amount);
    };
  };

  public type leader_board = {
    user_prin : Principal;
    bet_id : Nat64;
    wonn_amount : Nat;
  };

  var leader : [leader_board] = [];

  public func set_winner_det(details : leader_board) : async Text {
    leader := Array.append<leader_board>(leader, [details]);
    return "updated";
  };

  public shared query func get_leader(bet_id : Nat64) : async ?leader_board {
    let filtered_leader = Array.filter<leader_board>(leader, func x = x.bet_id == bet_id);

    if (filtered_leader.size() == 0) {
      return null;
    };

    let highest = Array.foldLeft<leader_board, leader_board>(
      filtered_leader,
      filtered_leader[0],
      func(acc, curr) {
        if (curr.wonn_amount > acc.wonn_amount) {
          curr;
        } else {
          acc;
        };
      },
    );

    return ?highest;
  }

};
