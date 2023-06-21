type Props = {
    modalType? : string,
    setModalType? : (newModal: string) => void
    loading? : boolean,
    setLoading? : (newLoading: boolean) => void
}

function ButtonsComponent({
                              modalType,
                              setModalType,
                              loading,
                              setLoading
                          }: Props) {

    // Open 'entry' modal
    function dataEntryModal() {
        if (setModalType) {
            setModalType('entry')
        }
        if (setLoading) {
            setLoading(true)
        }
    }

    // Open 'config' modal
    function configLeaderboard() {
        if (setModalType) {
            setModalType('config')
        }
        if (setLoading) {
            setLoading(true)
        }
    }

    return (
        <div>
            <button className={ 'p-1 rounded bg-gray-300 text-black mr-2'} onClick={ () => dataEntryModal() }>Insert Data</button>
            <button className={ 'p-1 rounded bg-green-600 text-white'} onClick={ () => configLeaderboard() }>Load Leaderboard</button>
        </div>
    )
}

export default ButtonsComponent;