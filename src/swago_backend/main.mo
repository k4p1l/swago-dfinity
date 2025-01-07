import Nat "mo:base/Nat";
import Nat64 "mo:base/Nat64";
import List "mo:base/List";
import Array "mo:base/Array";
import Option "mo:base/Option";
import Bool "mo:base/Bool";
import Principal "mo:base/Principal";
import Types "./Types";
import Result "mo:base/Result";
import HashMap "mo:base/HashMap";
import Blob "mo:base/Blob";
import Time "mo:base/Time";
import Timer "mo:base/Timer";
// import LedgerIndex "canister:icp_index_canister";

actor {
  stable var transactionId: Types.TransactionId = 0;
  stable var nfts = List.nil<Types.Nft>();
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
  };

  public type Create_Betting_data = {
    user_principal:Principal;
    name :Text;
    question:Text;
    start_time:Time.Time;
    set_Time:Time.Time;
    image:Blob;
    twitter_link:Text;
    telegram_link:Text;
    website_link:Text;
    countdown_style:Nat64;
    betting_id: Nat64;
  };



  var user_Betting:[Create_Betting_data] = [];

  public func add_Betting(betting :Create_Betting ):async Text {
    let current_betting_id = betting_id_no;
    let new_betting = {
      user_principal=betting.user_principal;
      name = betting.name;
      question=betting.question;
      start_time:Time.Time = Time.now()/1_000_000_000;
      set_Time=(betting.set_Time)/ 1_000_000_000;
      image=betting.image;
      twitter_link = betting.twitter_link;
      telegram_link = betting.telegram_link;
      website_link = betting.website_link;
      countdown_style = betting.countdown_style;
      betting_id = current_betting_id;
      status:Nat64 = 0;
    };
    user_Betting := Array.append<Create_Betting_data>(user_Betting , [new_betting]);
    betting_id_no := new_betting.betting_id+1;
    return "Betting Created";
  };

  public shared query func get_Betting_no(): async Nat64 {
    return betting_id_no;
  };

  public shared query func get_All_Bettings() : async [Create_Betting] {
    return user_Betting ;
  };

  public shared query func get_My_Bettings(user_principal:Principal): async [Create_Betting] {
    return Array.filter<Create_Betting>(user_Betting ,  func x=x.user_principal == user_principal);
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
  public func Yes_or_no_fun(data:yes_or_no): async Text{
    yesNo_Arr:=Array.append<yes_or_no>(yesNo_Arr , [data]);
    return "OK";
  };

};