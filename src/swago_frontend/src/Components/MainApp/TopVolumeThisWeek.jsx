import pfp from "../../assets/images/1330515.jpg";

export const TopVolumeThisWeek = () => {
  return (
    <div className="flex max-w-xl mt-8 sm:gap-4">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <td></td>
            <td>Name(Symbol)</td>
            <td>Market Cap</td>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>
              <img
                className="w-[5rem] object-contain rounded-sm"
                src={pfp}
                alt=""
              />
            </td>
            <td>Sundog($SUNDOG)</td>
            <td>$145.51M</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
